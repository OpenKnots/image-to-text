import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiTester } from "@/components/api-tester";

export function Landing() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src="/logo.svg"
          alt="Bun Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src="/react.svg"
          alt="React Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] [animation:spin_20s_linear_infinite]"
        />
      </div>
      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="text-3xl font-bold">Image to Text</CardTitle>
          <CardDescription>
            Upload an image and get the text extracted from it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiTester />
        </CardContent>
      </Card>
    </div>
  );
}

export default Landing;
