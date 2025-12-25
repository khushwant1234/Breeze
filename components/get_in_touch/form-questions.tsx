"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 2 characters.",
  }),
});

export default function Question() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    const mailtoLink = `mailto:breeze@snu.edu.in?subject=Contact%20Form%20Submission&body=${encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nDescription: ${data.description}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="bg-muted main flex px-5 flex-col lg:flex-row p-8 sm:ml-0 overflow-hidden">
      <div className="text w-full flex self-center flex-col pt-4 gap-4 text-center flex-1">
        <h1 className="text-2xl lg:text-4xl self-center leading-tight sm:leading-[3.5rem] font-medium">
          We've Got All The Answers You Need.
        </h1>
        <p className="w-[90%] self-center leading-normal text-center lg:text-lg text-muted-foreground">
          Ready to immerse yourself in the exhilarating Breeze experience? We're
          just a message away! Whether you have questions or need details, we're
          here to ensure this event becomes an unforgettable memory.
        </p>
      </div>
      <div className="lg:pl-4 pt-6 lg:pt-0 items-center text-left gap-y-4 gap-x-4 w-[90%] self-center lg:w-1/2 flex-1 lg:ml-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid items-center">
                  <FormLabel className="text-xl lg:text-2xl pb-1 lg:pb-3">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 rounded-lg lg:text-xl w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-lg lg:text-base" />
                </FormItem>
              )}
            />
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid items-center">
                  <FormLabel className="text-xl lg:text-2xl pb-1 lg:pb-3">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      className="h-12 rounded-lg lg:text-xl w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-lg lg:text-base" />
                </FormItem>
              )}
            />
            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="grid items-center">
                  <FormLabel className="text-xl lg:text-2xl pb-1 lg:pb-3">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 rounded-lg lg:text-xl w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-lg lg:text-base" />
                </FormItem>
              )}
            />
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid items-center">
                  <FormLabel className="text-xl lg:text-2xl pb-1 lg:pb-3">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 rounded-lg lg:text-xl w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-lg lg:text-base" />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <div className="col-span-1 sm:col-span-2 w-full pt-8">
              <Button
                type="submit"
                className="rounded-lg bg-black text-white text-lg lg:text-xl h-16 w-full"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}