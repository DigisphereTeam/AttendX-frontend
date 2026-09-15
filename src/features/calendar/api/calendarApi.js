import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";

const CALENDAR_ENDPOINTS = {
  GET_ALL: "/event/getevents",
  ADD: "/event/addevent",
  DELETE: "/event/deleteevent",
};

// --- Fetch Events ---
export const getEvents = async () => {
  const { data } = await axiosInstance.get(CALENDAR_ENDPOINTS.GET_ALL);
  return data;
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (response) => {
      const rawList = response?.events || [];

      return rawList.map((event) => ({
        id: event.event_id?.toString(),
        title: event.event_title || "",
        type: (event.event_type || "event").toLowerCase(),
        date: event.event_date ? event.event_date.split("T")[0] : "",
        time: event.event_time ? event.event_time.slice(0, 5) : "All Day",
        notes: event.description || "",
        raw: event,
      }));
    },
  });
};

// --- Add Event Mutation ---
export const addEventApi = async (newEventData) => {
  const { data } = await axiosInstance.post(CALENDAR_ENDPOINTS.ADD, newEventData);
  return data;
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEventApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(response?.message || "Event added successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add event");
    },
  });
};

// --- Delete Event Mutation ---
export const deleteEventApi = async (eventId) => {
  const { data } = await axiosInstance.delete(
    `${CALENDAR_ENDPOINTS.DELETE}?event_id=${eventId}`
  );
  return data;
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEventApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(response?.message || "Event deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    },
  });
};