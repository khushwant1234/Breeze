"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleEventRegistration(eventId: string, registrationOpen: boolean) {
  try {
    await prisma.eventItem.update({
      where: { id: eventId },
      data: { registration_open: registrationOpen },
    });
    revalidatePath("/admin/breeze-admin/events");
    revalidatePath("/admin/clubs");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle registration" };
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
      event_type: formData.get("event_type") as "Cultural" | "Technical",
    };
    await prisma.eventItem.update({
      where: { id: eventId },
      data: {
        event_name: eventData.event_name?.toString() || "",
        event_description: eventData.event_description?.toString() || "",
        event_price: eventData.event_price,
        event_org: eventData.event_org?.toString() || "",
        event_venue: eventData.event_venue?.toString() || "",
        event_date: eventData.event_date?.toString() || "",
        event_type: eventData.event_type,
      },
    });

    revalidatePath("/admin/breeze-admin/events");
    revalidatePath("/admin/clubs");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await prisma.eventItem.delete({
      where: { id: eventId },
    });
    revalidatePath("/admin/breeze-admin/events");
    revalidatePath("/admin/clubs");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete event" };
  }
}
