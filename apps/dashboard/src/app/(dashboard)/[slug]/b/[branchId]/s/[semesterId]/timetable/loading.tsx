import { Spinner } from "@instello/ui/components/spinner";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-180px)] items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
