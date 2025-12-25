"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Roles } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { createEvent } from "./actions";

export default function AddEvent({ curr_club }: { curr_club: Roles }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 5MB in bytes

  const validateFileSize = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return false;
    }
    return true;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM do yyyy");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  async function handleSubmit(formData: FormData) {
    const posterFile = formData.get('event_poster') as File;
    
    if (!validateFileSize(posterFile)) {
      setError("Image size must be less than 4MB");
      return;
    }

    const rawDate = formData.get('event_date') as string;
    const rawTime = formData.get('event_time') as string;
    
    const formattedDate = formatDate(rawDate);
    const formattedTime = formatTime(rawTime);
    
    const modifiedFormData = new FormData();
    formData.forEach((value, key) => {
      if (key === 'event_date') {
        modifiedFormData.append(key, formattedDate);
      } else if (key === 'event_time') {
        modifiedFormData.append(key, formattedTime);
      } else {
        modifiedFormData.append(key, value);
      }
    });

    const result = await createEvent(modifiedFormData);
    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
  }

  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90">
            Create Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">
              Create New Event
            </DialogTitle>
          </DialogHeader>
          {error && (
            <div className="text-destructive text-sm font-medium">{error}</div>
          )}
          <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="event_org" value={curr_club.club_name} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Name</label>
              <Input
                name="event_name"
                className="w-full"
                placeholder="Enter event name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="event_description"
                className="w-full"
                placeholder="Enter event description"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                name="event_price"
                className="w-full"
                placeholder="Enter event price"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue</label>
              <Input
                name="event_venue"
                className="w-full"
                placeholder="Enter event venue"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                name="event_date"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                name="event_time"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Poster</label>
              <Input
                type="file"
                name="event_poster"
                className="w-full"
                accept="image/*"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && !validateFileSize(file)) {
                    setError("Image size must be less than 4MB");
                  } else {
                    setError("");
                  }
                }}
              />
              <span className="text-xs text-gray-500">Max file size: 4MB</span>
            </div>
            <Button type="submit" className="w-full">
              Create Event
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
