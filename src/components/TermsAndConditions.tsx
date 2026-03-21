import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';

interface TermsAndConditionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
}

export const TermsAndConditions = ({
  open,
  onOpenChange,
  onAccept,
  onReject,
}: TermsAndConditionsProps) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      setAccepted(false);
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    onReject();
    setAccepted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms before continuing
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 border rounded-lg p-4 bg-slate-50">
          <div className="space-y-4 pr-4">
            {/* Introduction */}
            <section>
              <h3 className="font-bold text-lg mb-2">Welcome to SkillCoders</h3>
              <p className="text-sm text-gray-700">
                These Terms and Conditions ("Terms") govern your use of SkillCoders platform,
                website, and services. By accessing and using SkillCoders, you agree to be bound
                by these Terms. If you do not agree to any part of these Terms, you may not use
                our services.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h3 className="font-bold text-lg mb-2">1. User Responsibilities</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>You must be at least 13 years old to use SkillCoders services.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree not to share your account with others or use another person's account.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>You agree to provide accurate and complete information during registration.</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h3 className="font-bold text-lg mb-2">2. Acceptable Use Policy</h3>
              <p className="text-sm text-gray-700 mb-2">You agree not to:</p>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Upload, post, or transmit any content that is illegal, offensive, or harmful.</li>
                <li>Engage in harassment, bullying, or any discriminatory behavior.</li>
                <li>Attempt to gain unauthorized access to the platform or other users' accounts.</li>
                <li>Copy, duplicate, or redistribute course content without permission.</li>
                <li>Use automated tools, bots, or scripts to access the platform.</li>
                <li>Violate any applicable laws or regulations.</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="font-bold text-lg mb-2">3. Intellectual Property Rights</h3>
              <p className="text-sm text-gray-700 mb-2">
                All course materials, content, software, and designs on SkillCoders are the property
                of SkillCoders or its content creators and are protected by copyright and other
                intellectual property laws.
              </p>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>
                  You are granted a limited, non-exclusive, non-transferable license to access
                  and view the content for personal, non-commercial purposes.
                </li>
                <li>You may not reproduce, distribute, or transmit any content without permission.</li>
                <li>
                  Instructors retain all rights to their course materials and intellectual property.
                </li>
              </ul>
            </section>

            {/* Payment and Refunds */}
            <section>
              <h3 className="font-bold text-lg mb-2">4. Payment and Refunds</h3>
              <p className="text-sm text-gray-700 mb-2">
                • Payments are processed securely through Razorpay.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • All prices are in Indian Rupees (INR) and inclusive of applicable taxes.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • Refunds are available within 7 days of course enrollment, provided less than
                30% of the course content has been accessed.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • No refund will be issued after 7 days or if course access is complete.
              </p>
              <p className="text-sm text-gray-700">
                • Payment receipts will be sent via email and WhatsApp automatically.
              </p>
            </section>

            {/* User Content */}
            <section>
              <h3 className="font-bold text-lg mb-2">5. User-Generated Content</h3>
              <p className="text-sm text-gray-700 mb-2">
                By posting comments, feedback, or content on SkillCoders, you grant us the right
                to use, display, and modify that content. You retain ownership of your personal
                information but grant SkillCoders a license to use it as described in our Privacy
                Policy.
              </p>
            </section>

            {/* School and Parent Consent */}
            <section>
              <h3 className="font-bold text-lg mb-2">6. School Registration and Parent Consent</h3>
              <p className="text-sm text-gray-700 mb-2">
                For school registrations and students under 18:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Schools must provide accurate information about students and curriculum.</li>
                <li>
                  Parents/guardians consent to student enrollment and receive notifications.
                </li>
                <li>Schools agree to comply with data protection and privacy regulations.</li>
                <li>
                  SkillCoders will send periodic progress updates and announcements via email
                  and WhatsApp.
                </li>
              </ul>
            </section>

            {/* Messaging and Communication */}
            <section>
              <h3 className="font-bold text-lg mb-2">7. Messaging and Communication</h3>
              <p className="text-sm text-gray-700 mb-2">
                • Instructors may create group chats for class communication and announcements.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • All communication must remain respectful and professional.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • Messages may be monitored for safety and policy compliance.
              </p>
              <p className="text-sm text-gray-700">
                • Users have the right to mute notifications or leave groups at any time.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className="font-bold text-lg mb-2">8. Limitation of Liability</h3>
              <p className="text-sm text-gray-700 mb-2">
                SkillCoders is provided on an "as-is" basis. SkillCoders does not warrant that:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>The service will meet your specific requirements.</li>
                <li>The service will be uninterrupted or error-free.</li>
                <li>Any defects will be corrected.</li>
                <li>The service or server are free of viruses or malicious code.</li>
              </ul>
              <p className="text-sm text-gray-700 mt-2">
                To the maximum extent permitted by law, SkillCoders shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            {/* Cancellation and Termination */}
            <section>
              <h3 className="font-bold text-lg mb-2">9. Cancellation and Termination</h3>
              <p className="text-sm text-gray-700 mb-2">
                SkillCoders may terminate or suspend your account if you violate these Terms.
                Upon termination:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Your access to courses and content will be revoked.</li>
                <li>Ongoing payments will not be refunded except where required by law.</li>
                <li>Your data may be retained as per our Privacy Policy.</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h3 className="font-bold text-lg mb-2">10. Changes to Terms</h3>
              <p className="text-sm text-gray-700">
                SkillCoders may modify these Terms at any time. Continued use of the platform
                after changes constitute acceptance of the new Terms. We recommend reviewing
                this page periodically.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h3 className="font-bold text-lg mb-2">11. Governing Law</h3>
              <p className="text-sm text-gray-700">
                These Terms are governed by the laws of India and subject to the exclusive
                jurisdiction of the courts in India.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h3 className="font-bold text-lg mb-2">12. Contact Us</h3>
              <p className="text-sm text-gray-700 mb-2">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <p>📧 Email: support@skillcoders.com</p>
                <p>📞 Phone: +91-XXXXXXXXXX</p>
                <p>🌐 Website: www.skillcoders.com</p>
              </div>
            </section>

            {/* Acceptance */}
            <section>
              <h3 className="font-bold text-lg mb-2">13. Acceptance</h3>
              <p className="text-sm text-gray-700">
                By clicking "I Accept", you acknowledge that you have read, understood, and
                agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </ScrollArea>

        {/* Acceptance Checkbox and Buttons */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <Label htmlFor="accept-terms" className="text-sm cursor-pointer font-medium">
                I agree to the Terms and Conditions and understand my responsibilities.
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="accept-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <Label htmlFor="accept-terms" className="font-medium cursor-pointer">
              I have read and accept all terms
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!accepted}
              className="flex-1"
            >
              Accept Terms
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
