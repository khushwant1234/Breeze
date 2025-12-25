import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import AddEvent from "./add-event";
import EventTable from "./event-table";

export default async function Page() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const curr_club = await prisma.roles.findFirst({
    where: { email: user.data.user.email },
  });
  const events = await prisma.eventItem.findMany({
    where: { event_org: curr_club.club_name },
  });
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        All events for {curr_club.club_name}
      </h1>
      {/* <AddEvent curr_club={curr_club} /> */}
      <EventTable curr_club={curr_club} events={events} />
    </div>
  );
}
