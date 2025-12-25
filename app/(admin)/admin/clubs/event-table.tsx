"use client";
import { EventItem, Roles } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteEvent } from "./actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { EditEventDialog } from "./edit-event-dialog";
import { useState } from "react";

export default function EventTable({
  curr_club,
  events,
}: {
  curr_club: Roles;
  events: EventItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Table className="border rounded-lg">
        <TableCaption className="text-lg font-medium mb-4">
          Event List
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Event Name</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold">Venue</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Time</TableHead>
            {/* <TableHead className="font-semibold">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event) => (
              <TableRow key={event.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{event.event_name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {event.event_description}
                </TableCell>
                <TableCell>₹{event.event_price}</TableCell>
                <TableCell>{event.event_venue}</TableCell>
                <TableCell>{event.event_date}</TableCell>
                <TableCell>{event.event_time}</TableCell>
                {/* <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await deleteEvent(event.id);
                          router.refresh();
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EditEventDialog
        curr_club={curr_club}
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
