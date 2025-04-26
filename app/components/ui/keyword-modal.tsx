import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
} from "~/components/ui/dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Form } from "@remix-run/react"

type KeywordModalProps = {
    campaignId: string;
    trigger: React.ReactNode;
}

export function KeywordModal({ campaignId, trigger }: KeywordModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Keyword</DialogTitle>
                    </DialogHeader>
                    <Form method="post" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="keyword">Keyword</Label>
                            <Input
                                id="keyword"
                                name="keyword"
                                placeholder="Enter keyword"
                                required
                            />
                        </div>
                        <input type="hidden" name="intent" value="add_keyword" />
                        <input type="hidden" name="campaignId" value={campaignId} />
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="submit">Add Keyword</Button>
                        </div>
                    </Form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
} 