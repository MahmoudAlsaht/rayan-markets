import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { LoadingLink } from "@/context/LoadingContext";

export default function Widget({
  title,
  href,
  danger,
}: {
  danger?: boolean;
  title: string;
  href: string;
}) {
  return (
    <>
      <Card dir="rtl" className="border-none">
        <CardHeader>
          <CardTitle
            className={danger ? "text-destructive" : "text-rayanPrimary-dark"}
          >
            {title}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Button
            asChild
            className={`${
              danger
                ? "text-destructive hover:bg-destructive"
                : "text-rayanPrimary-dark hover:bg-rayanPrimary-dark"
            } hover:text-white`}
            variant="outline"
          >
            <LoadingLink href={href}>
              انظر المزيد
              <MoveLeft className="mr-4" />
            </LoadingLink>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
