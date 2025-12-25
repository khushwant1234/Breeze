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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventItem } from "@prisma/client";
import { useEffect, useState } from "react";
import { updateEvent } from "./actions";
import { useRouter } from "next/navigation";

export function EditEventDialog({
  event,
  open,
  onOpenChange,
}: {
  event: EventItem | null;
  open: boolean;
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-[#202020]/10">
        <DialogHeader className="pb-4 border-b border-[#202020]/10">
          <DialogTitle className="text-3xl font-bold text-[#202020] tracking-tight">
            Edit Event
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Update event details (Admin)
          </p>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            await updateEvent(eventData.id, formData);
            router.refresh();
            onOpenChange(false);
          }}
          className="space-y-5 pt-4"
        >
          <div className="space-y-2">
            <Label
              className="text-sm font-semibold text-[#202020]"
              htmlFor="event_name"
            >
              Event Name
            </Label>
            <Input
              id="event_name"
              name="event_name"
              defaultValue={eventData.event_name}
              className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-semibold text-[#202020]"
              htmlFor="event_description"
            >
              Description
            </Label>
            <Input
              id="event_description"
              name="event_description"
              defaultValue={eventData.event_description}
              className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-[#202020]"
                htmlFor="event_org"
              >
                Organizing Club
              </Label>
              <Input
                id="event_org"
                name="event_org"
                defaultValue={eventData.event_org || ""}
                className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-[#202020]"
                htmlFor="event_type"
              >
                Event Type
              </Label>
              <Select
                name="event_type"
                defaultValue={eventData.event_type || "Cultural"}
              >
                <SelectTrigger className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-[#202020]"
                htmlFor="event_price"
              >
                Price (₹)
              </Label>
              <Input
                id="event_price"
                name="event_price"
                type="number"
                defaultValue={eventData.event_price}
                className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-[#202020]"
                htmlFor="event_venue"
              >
                Venue
              </Label>
              <Input
                id="event_venue"
                name="event_venue"
                defaultValue={eventData.event_venue || ""}
                className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-[#202020]"
                htmlFor="event_date"
              >
                Date
              </Label>
              <Input
                id="event_date"
                name="event_date"
                defaultValue={eventData.event_date || ""}
                className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-sm font-semibold text-[#202020]"
                htmlFor="event_time"
              >
                Time
              </Label>
              <Input
                id="event_time"
                name="event_time"
                defaultValue={eventData.event_time || ""}
                className="w-full border-[#202020]/20 focus:border-[#202020] focus:ring-[#202020] bg-gray-50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#202020]/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#202020]/20 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#202020] hover:bg-[#303030] text-white font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
