import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import prisma from "~/utils/db.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "@remix-run/react";

export async function loader({ params }: { params: { id: string } }) {
    const campaign = await prisma.campaign.findUnique({
        where: { id: params.id },
        include: {
            keywords: true
        }
    });

    if (!campaign) {
        throw new Response("Campaign not found", { status: 404 });
    }

    return Response.json({ campaign })
}

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const daily_budget = formData.get("daily_budget");

    try {
        await prisma.campaign.update({
            where: { id: id as string },
            data: { name: name as string, daily_budget: parseInt(daily_budget as string) }
        });

        return redirect("/");
    } catch (error) {
        console.error("Error updating campaign:", error);
        return json({ error: "Failed to update campaign" }, { status: 500 });
    }
}

const CampaignEdit = () => {
    const { campaign } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="h-screen container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Edit Campaign</h1>
                <Link to="/">
                    <Button variant="outline">Back to Campaigns</Button>
                </Link>
            </div>

            <Card className="my-20 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form method="post" className="space-y-6">
                        <input type="hidden" name="id" value={campaign.id} />
                        
                        <div className="space-y-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={campaign.name}
                                placeholder="Enter campaign name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="daily_budget">Daily Budget</Label>
                            <Input
                                id="daily_budget"
                                name="daily_budget"
                                type="number"
                                defaultValue={campaign.daily_budget}
                                placeholder="Enter daily budget"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link to="/">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CampaignEdit;