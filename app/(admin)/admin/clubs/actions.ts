"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function createEvent(formData: FormData) {
    try {
      const supabase = await createClient();
      const eventPoster = formData.get("event_poster") as File;
      const {data, error} = await supabase.storage.from("assets").upload(`${Date.now()}_${eventPoster.name}`, eventPoster);
      if (error) {
        return { success: false, error: "Failed to upload image" };
      }
      
      const eventData = {
        event_name: formData.get("event_name"),
        event_description: formData.get("event_description"),
        event_price: Number(formData.get("event_price")),
        event_venue: formData.get("event_venue"),
        event_date: formData.get("event_date"),
        event_time: formData.get("event_time"),
        event_org: formData.get("event_org"),
      };
  
      await prisma.eventItem.create({
        data: {
          event_name: eventData.event_name.toString(),
          event_description: eventData.event_description.toString(),
          event_price: eventData.event_price,
          event_org: eventData.event_org.toString(),
          event_date: eventData.event_date.toString(),
          event_time: eventData.event_time.toString(),
          image_url: data.fullPath
        },
      });
      revalidatePath("/admin/clubs");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to create event" };
    }
}
  
export async function deleteEvent(eventId: string) {
  try {
    await prisma.eventItem.delete({
      where: {
        id: eventId
      }
    });
    revalidatePath("/admin/clubs");
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete event' };
  }
}

export async function updateEvent(eventId: string, formData: FormData) {
  try {
    const eventData = {
      event_name: formData.get("event_name"),
      event_description: formData.get("event_description"),
      event_price: Number(formData.get("event_price")),
      event_venue: formData.get("event_venue"),
      event_date: formData.get("event_date"),
      event_org: formData.get("event_org"),
      event_time: formData.get("event_time"),
    };
    await prisma.eventItem.update({
      where: { id: eventId },
      data:  {
        event_name: eventData.event_name.toString(),
        event_description: eventData.event_description.toString(),
        event_price: eventData.event_price,
        event_org: eventData.event_org.toString(),
        event_venue: eventData.event_venue.toString(),
        event_date: eventData.event_date.toString(),
        event_time: eventData.event_time.toString(),
      },
    });
    
    revalidatePath("/admin/clubs");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update event" };
  }
}