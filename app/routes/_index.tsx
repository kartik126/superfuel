import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import CampaignList from "~/components/CampaignList";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
  const intent = formData.get("intent");
  if (intent === "delete-campaign") {
    const id = formData.get("id");
    await prisma.campaign.delete({
      where: { id: id as string }
    });
    return { message: "Campaign deleted" };
  }

  if (intent === "create-campaign") {
    const campaign = await prisma.campaign.create({
      data: {
        name: name as string,
        daily_budget
      }
    });
    return { campaign };
  }
}

export default function Index() {
  const { campaigns } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Campaigns List</h1>
        {/* For some reason Modal was not working So put the form outside of the modal */}
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              type="text"
              name="name"
              id="name"
              className="w-1/2 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="daily_budget" className="block text-sm font-medium text-gray-700">Daily Budget</label>
            <Input
              type="number"
              name="daily_budget"
              id="daily_budget"
              className="w-1/2 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <Form method="post">
            <input type="hidden" name="intent" value="create-campaign" />
            <Button
              type="submit"
            >
              Create Campaign
            </Button>
          </Form>
        </Form>

        <CampaignList campaigns={campaigns} />
      </div>
    </div>
  );
}
