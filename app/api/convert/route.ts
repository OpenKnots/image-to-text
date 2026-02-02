import { streamObject } from "ai";
import { isSupportedImageType, schema } from "@/lib/utils";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
	const ip = getClientIp(req) ?? "unknown";
	const rateLimit = checkRateLimit(ip);
	if (!rateLimit.allowed) {
		return new Response("Rate limit exceeded. Try again soon.", {
			status: 429,
			headers: {
				"Retry-After": rateLimit.retryAfterSeconds.toString(),
			},
		});
	}

	const base64 = await req.json();
	if (typeof base64 !== "string")
		return new Response("Invalid image data", { status: 400 });

	// roughly 4.5MB in base64
	if (base64.length > 6_464_471) {
		return new Response("Image too large, maximum file size is 4.5MB.", {
			status: 400,
		});
	}

	const { mediaType, image } = decodeBase64Image(base64);

	if (!mediaType || !image)
		return new Response("Invalid image data", { status: 400 });

	if (!isSupportedImageType(mediaType)) {
		return new Response(
			"Unsupported format. Only JPEG, PNG, GIF, and WEBP files are supported.",
			{ status: 400 }
		);
	}

	const result = streamObject({
		model: "openai/gpt-4.1-nano",
		maxOutputTokens: 300,
		schema,
		messages: [
			{
				role: "user",
				content: [
					{
						type: "image",
						image,
						mediaType,
					},
				],
			},
		],
	});

	return result.toTextStreamResponse();
}

function decodeBase64Image(dataString: string) {
	const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

	return {
		mediaType: matches?.[1],
		image: matches?.[2],
	};
}

function getClientIp(req: Request) {
	const forwardedFor = req.headers.get("x-forwarded-for");
	if (forwardedFor) return forwardedFor.split(",")[0]?.trim();
	return req.headers.get("x-real-ip");
}

function checkRateLimit(key: string) {
	const now = Date.now();
	const entry = rateLimitStore.get(key);

	if (!entry || entry.resetAt <= now) {
		rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return { allowed: true, retryAfterSeconds: 0 };
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
		return { allowed: false, retryAfterSeconds };
	}

	entry.count += 1;
	return { allowed: true, retryAfterSeconds: 0 };
}