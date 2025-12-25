import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const curr_club = await prisma.roles.findFirst({
    where: { email: user.data.user.email },
  });
  const events = await prisma.eventItem.findMany({
    where: { event_org: curr_club.club_name },
  });

  let grandTotal = 0;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Event Participants</h1>
      {events.map(async (event) => {
        const users = await prisma.confirmedEvent.findMany({
          where: {
            EventItem: {
              event_org: curr_club.club_name,
              id: event.id,
            },
          },
          include: { SubmittedTransaction: true },
        });

        const eventTotal = users.reduce(
          (acc, user) => acc + Number(user.quantity) * Number(event.event_price),
          0
        );
        grandTotal += eventTotal;

        return (
          <div key={event.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {event.event_name}
            </h2>
            <Table className="border rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-semibold text-gray-900">
                    Attendee Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Address
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Number of Passes
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Transaction Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {user.SubmittedTransaction.name}
                      </TableCell>
                      <TableCell>{user.SubmittedTransaction.email}</TableCell>
                      <TableCell>{user.SubmittedTransaction.phone}</TableCell>
                      <TableCell>{user.SubmittedTransaction.address}</TableCell>
                      <TableCell>{Number(user.quantity)}</TableCell>
                      <TableCell>
                        ₹{Number(user.quantity) * Number(event.event_price)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No participants currently
                    </TableCell>
                  </TableRow>
                )}
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-semibold">
                      Event Total
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{eventTotal}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </TableBody>
            </Table>
          </div>
        );
      })}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-bold text-right">
          Grand Total: ₹{grandTotal}
        </h2>
      </div>
    </div>
  );
}
