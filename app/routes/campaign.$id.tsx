import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import prisma from "~/utils/db.server";
import { useEffect, useState } from "react";

type Keyword = {
    id: string;
    text: string;
    campaignId: string;
    createdAt: Date;
    updatedAt: Date;
};

type Campaign = {
    id: string;
    name: string;
    daily_budget: number;
    keywords: Keyword[];
    createdAt: Date;
    updatedAt: Date;
};

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
    const intent = formData.get("intent");
    const keyword = formData.get("keyword");
    const keywordId = formData.get("keywordId");
    const campaignId = formData.get("campaignId");

    console.log("Action triggered with:", { intent, keyword, campaignId });

    if (intent === "add_keyword" && keyword && campaignId) {
        try {
            const newKeyword = await prisma.keyword.create({
                data: {
                    text: keyword as string,
                    campaignId: campaignId as string
                }
            });
            console.log("Keyword created:", newKeyword);
            return Response.json({ keyword: newKeyword });
        } catch (error) {
            console.error("Error creating keyword:", error);
            return Response.json({ error: "Failed to create keyword" }, { status: 500 });
        }
    }

    if (intent === "delete_keyword" && keywordId) {
        try {
            await prisma.keyword.delete({
                where: { id: keywordId as string }
            });
        } catch (error) {
            console.error("Error deleting keyword:", error);
            return Response.json({ error: "Failed to delete keyword" }, { status: 500 });
        }
    }

    return json({ error: "Invalid request" }, { status: 400 });
}

const CampaignDetails = () => {
    const { campaign } = useLoaderData<typeof loader>();
    const [keywords, setKeywords] = useState<Keyword[]>(campaign.keywords);
    const [newKeyword, setNewKeyword] = useState("");

    const handleAddKeyword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyword.trim()) return;
        setNewKeyword("");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Campaign Details</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Name</h2>
                    <p className="text-gray-900">{campaign.name}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Daily Budget</h2>
                    <p className="text-gray-900">${campaign.daily_budget}</p>
                </div>

                <Form method="post" onSubmit={handleAddKeyword} className="mb-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="keyword" className="text-sm font-medium text-gray-700">
                            Add Keyword
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 flex-1"
                                placeholder="Enter keyword"
                            />
                            <input type="hidden" name="intent" value="add_keyword" />
                            <input type="hidden" name="campaignId" value={campaign.id} />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Add Keyword
                            </button>
                        </div>
                    </div>
                </Form>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Keywords</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Keyword
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Added Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {keywords.map((keyword) => (
                                    <tr key={keyword.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {keyword.text}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(keyword.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="gap-4 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Form method="post">
                                                <input type="hidden" name="intent" value="delete_keyword" />
                                                <input type="hidden" name="keywordId" value={keyword.id} />
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    type="submit"
                                                >
                                                    Delete
                                                </button>
                                            </Form>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetails;