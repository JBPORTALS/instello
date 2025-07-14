import { Separator } from "@instello/ui/components/separator";
import { SidebarTrigger } from "@instello/ui/components/sidebar";

interface SiteHeaderProps {
  title?: string;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
}

export function SiteHeader({
  title,
  startElement,
  endElement,
}: SiteHeaderProps) {
  return (
    <header className="bg-sidebar flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Sidebar button */}
        <SidebarTrigger className="-ml-1" />

        {/* Optional title */}
        {title && (
          <>
            <Separator orientation="vertical" className="mx-2 !h-4" />
            <h1 className="truncate text-sm font-medium">{title}</h1>
          </>
        )}

        {/* Optional start element */}
        {startElement && (
          <>
            <Separator orientation="vertical" className="mx-2 !h-4" />
            <div className="flex items-center">{startElement}</div>
          </>
        )}

        {/* Right-aligned end element */}
        {endElement && (
          <div className="ml-auto flex items-center gap-2">{endElement}</div>
        )}
      </div>
    </header>
  );
}
