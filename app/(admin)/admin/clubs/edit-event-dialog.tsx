"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventItem, Roles } from "@prisma/client";
import { useEffect, useState } from "react";
import { updateEvent } from "./actions";
import { useRouter } from "next/navigation";

export function EditEventDialog({
  event,
  open,
  onOpenChange,
  curr_club,
}: {
  event: EventItem | null;
  open: boolean;
  curr_club: Roles;
  onOpenChange: (open: boolean) => void;
}) {
  const [eventData, setEventData] = useState<EventItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    setEventData(event);
  }, [event]);

  if (!eventData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold">Edit Event</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            await updateEvent(eventData.id, formData);
            router.refresh();
            onOpenChange(false);
          }}
          className="space-y-6"
        >
          <input type="hidden" name="event_org" value={curr_club.club_name} />
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="event_name">
              Event Name
            </Label>
            <Input
              id="event_name"
              name="event_name"
              defaultValue={eventData.event_name}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="event_description">
              Description
            </Label>
            <Input
              id="event_description"
              name="event_description"
              defaultValue={eventData.event_description}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="event_price">
              Price
            </Label>
            <Input
              disabled
              id="event_price"
              name="event_price"
              type="number"
              defaultValue={eventData.event_price}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="event_venue">
              Venue
            </Label>
            <Input
              id="event_venue"
              name="event_venue"
              defaultValue={eventData.event_venue || ""}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="event_date">
              Date
            </Label>
            <Input
              id="event_date"
              name="event_date"
              type="date"
              defaultValue={eventData.event_date}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="event_time">
              Time
            </Label>
            <Input
              id="event_time"
              name="event_time"
              type="time"
              defaultValue={eventData.event_time}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
