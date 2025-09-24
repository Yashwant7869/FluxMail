import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PreviewData {
  subject: string;
  content: string;
  recipientEmail: string;
  recipientName?: string;
}

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: PreviewData | null;
}

export default function EmailPreviewModal({ isOpen, onClose, previewData }: EmailPreviewModalProps) {
  if (!previewData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="modal-email-preview">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="border-b border-border pb-4 mb-4">
              <p className="text-sm text-muted-foreground">
                To: <span className="text-foreground" data-testid="text-preview-recipient">{previewData.recipientEmail}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Subject: <span className="text-foreground" data-testid="text-preview-subject">{previewData.subject}</span>
              </p>
            </div>
            
            <div className="prose max-w-none" data-testid="content-preview-body">
              <div dangerouslySetInnerHTML={{ __html: previewData.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              data-testid="button-close-preview"
            >
              Close
            </Button>
            <Button data-testid="button-send-test">
              Send Test Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
