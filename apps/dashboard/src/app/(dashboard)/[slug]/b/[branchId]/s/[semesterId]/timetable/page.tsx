import Container from "@/components/container";
import { ReactTimetable } from "@/components/timetable";

export default function Page() {
  return (
    <Container className="px-16">
      <h2 className="text-3xl font-semibold">Timetable</h2>

      <ReactTimetable />
    </Container>
  );
}
