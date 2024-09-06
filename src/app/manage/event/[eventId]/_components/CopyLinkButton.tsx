import { Check, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

interface Props {
  link: string;
}
function CopyLinkButton({ link }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [isCopied]);

  const handleCopy = () => {
    window.navigator.clipboard.writeText(link);
    setIsCopied(true);
  };
  return (
    <Button variant="outline" className="gap-2" onClick={handleCopy}>
      {isCopied ? (
        <Check size="1rem" className="text-green-500" />
      ) : (
        <Link size="1rem" />
      )}
      {isCopied ? "คัดลอกลิงค์แล้ว" : "คัดลอกลิงค์แสกน"}
    </Button>
  );
}

export default CopyLinkButton;
