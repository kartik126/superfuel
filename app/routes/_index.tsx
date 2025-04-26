import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import CampaignList from "~/components/CampaignList";
import prisma from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const campaigns = await prisma.campaign.findMany();
  return { campaigns };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const daily_budget = parseFloat(formData.get("daily_budget") as string);
  
  const campaign = await prisma.campaign.create({ 
    data: { 
      name: name as string,
      daily_budget 
    } 
  });
  
  return { campaign };
}

export default function Index() {
  const { campaigns } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Campaigns List</h1>

        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="daily_budget" className="block text-sm font-medium text-gray-700">Daily Budget</label>
            <input
              type="number"
              name="daily_budget"
              id="daily_budget"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Campaign
          </button>
        </Form>

        <CampaignList campaigns={campaigns} />
      </div>
    </div>
  );
}
