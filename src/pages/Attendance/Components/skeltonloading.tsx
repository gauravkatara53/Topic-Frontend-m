import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SkeletonCard = () => (
  <Card className="shadow-md animate-pulse">
    <CardContent className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
          <div className="h-4 w-10 bg-gray-300 rounded" />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="h-3 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-48 bg-gray-200 rounded" />
      </div>

      <div className="h-2 w-full bg-gray-300 rounded-full" />
    </CardContent>
  </Card>
);

export default SkeletonCard;
