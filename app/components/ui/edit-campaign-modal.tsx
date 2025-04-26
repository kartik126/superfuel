import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Form } from "@remix-run/react"

type EditCampaignModalProps = {
    campaign: {
        id: string;
        name: string;
        daily_budget: number;
    };
    trigger: React.ReactNode;
}

export function EditCampaignModal({ campaign, trigger }: EditCampaignModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Campaign</DialogTitle>
                </DialogHeader>
                <Form method="post" className="space-y-4">
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
                    <input type="hidden" name="intent" value="edit_campaign" />
                    <input type="hidden" name="campaignId" value={campaign.id} />
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 