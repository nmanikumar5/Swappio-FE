import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-2 h-8 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="border-t p-4">
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}
