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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 space-y-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#202020] tracking-tight mb-2">
            Event Participants
          </h1>
          <p className="text-gray-500 text-sm">
            View all registered participants and revenue details
          </p>
        </div>
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
            (acc, user) =>
              acc + Number(user.quantity) * Number(event.event_price),
            0
          );
          grandTotal += eventTotal;

          return (
            <div
              key={event.id}
              className="space-y-4 bg-gray-50 p-6 rounded-lg border border-[#202020]/10"
            >
              <h2 className="text-2xl font-semibold text-[#202020]">
                {event.event_name}
              </h2>
              <Table className="border border-[#202020]/10 rounded-lg bg-white">
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b border-[#202020]/10">
                    <TableHead className="font-semibold text-[#202020]">
                      Attendee Name
                    </TableHead>
                    <TableHead className="font-semibold text-[#202020]">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-[#202020]">
                      Phone
                    </TableHead>
                    <TableHead className="font-semibold text-[#202020]">
                      Roll Number
                    </TableHead>
                    <TableHead className="font-semibold text-[#202020]">
                      College
                    </TableHead>
                    <TableHead className="font-semibold text-[#202020]">
                      Number of Passes
                    </TableHead>
                    <TableHead className="font-semibold text-[#202020]">
                      Transaction Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow
                        key={event.id}
                        className="hover:bg-gray-50 transition-colors border-b border-[#202020]/5"
                      >
                        <TableCell className="font-medium text-[#202020]">
                          {user.SubmittedTransaction.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.SubmittedTransaction.email}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.SubmittedTransaction.phone}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.SubmittedTransaction.address}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.SubmittedTransaction.student_details || "—"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {Number(user.quantity)}
                        </TableCell>
                        <TableCell className="text-[#202020] font-semibold">
                          ₹{Number(user.quantity) * Number(event.event_price)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No participants currently
                      </TableCell>
                    </TableRow>
                  )}
                  <TableFooter>
                    <TableRow className="bg-gray-100">
                      <TableCell
                        colSpan={6}
                        className="text-right font-semibold text-[#202020]"
                      >
                        Event Total
                      </TableCell>
                      <TableCell className="font-bold text-[#202020]">
                        ₹{eventTotal}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </TableBody>
              </Table>
            </div>
          );
        })}
        <div className="mt-8 border-t border-[#202020]/20 pt-6 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-right text-[#202020]">
            Grand Total: ₹{grandTotal}
          </h2>
        </div>
      </div>
    </div>
  );
}
