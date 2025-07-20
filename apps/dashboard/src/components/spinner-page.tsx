import { Spinner } from "@instello/ui/components/spinner";

export function SpinnerPage() {
  return (
    <div className="flex h-[calc(100vh-104px)] w-full items-center justify-center">
      <Spinner className="text-muted-foreground size-8" />
    </div>
  );
}
