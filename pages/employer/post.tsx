"use client";
import CreatePostForm, { submit, __setSupabaseClient } from "@/components/posts/CreatePostForm";

export { submit, __setSupabaseClient };

export default function EmployerPostPage() {
  return <CreatePostForm />;
}

