import { GetServerSideProps } from "next";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const { data, error } = await supabase.from("gigs").select("*").eq("id", id).single();
  if (error || !data) return { notFound: true };
  return { props: { gig: data } };
};

export default function GigPage({ gig }: { gig: any }) {
  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
      {gig.image_url && <img src={gig.image_url} alt="" className="rounded mb-4 max-h-64 object-cover" />}
      <p className="opacity-90 mb-4 whitespace-pre-wrap">{gig.description}</p>
      <div className="text-sm opacity-80 space-x-4">
        <span>Budget: {gig.budget ?? "—"}</span>
        <span>City: {gig.city ?? "—"}</span>
      </div>
    </Shell>
  );
}
