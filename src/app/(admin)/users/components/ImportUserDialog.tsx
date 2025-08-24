import { FileUp, Loader } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import Codemirror from "@uiw/react-codemirror";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importUsersFn } from "~/requests/user/importUsersFn";
import { toast } from "sonner";
import { parse } from "csv-parse/sync";
import { userSchema } from "~/schemas/userSchema";
import { User } from "~/types";

type Tab = "file-uploader" | "editor";

function ImportUserDialog() {
  const [rawContent, setRawContent] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("file-uploader");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectFile = async (files: File[]) => {
    const content = await files[0].text();
    setRawContent(content);
    setSelectedTab("editor");
  };

  const queryClient = useQueryClient();
  const importUser = useMutation({
    mutationFn: importUsersFn,
    onSuccess: async () => {
      toast.success("Import ข้อมูลนิสิตสำเร็จ");
      await queryClient.refetchQueries({ queryKey: ["users"] });
      setIsOpen(false);
      setRawContent("");
      setSelectedTab("file-uploader");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Import ข้อมูลนิสิตไม่สำเร็จ");
    },
  });

  const handleImport = () => {
    const users = parse(rawContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const parsedUsers: User[] = [];
    for (const user of users) {
      const { success, data } = userSchema.safeParse(user);
      if (!success) {
        toast.error("มีข้อมูลในบางรายชื่อผิดพลาด โปรดตรวจสอบอีกครั้ง");
        return;
      }

      parsedUsers.push(data);
    }

    importUser.mutate(parsedUsers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex gap-2 border border-gray-500 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white"
          size="sm"
        >
          <FileUp size="1rem" />
          Import ข้อมูลนิสิต
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import ข้อมูลนิสิต</DialogTitle>
        </DialogHeader>
        <div className="px-4 py-2 rounded-lg bg-yellow-200  border border-yellow-500">
          <h5>รูปแบบการ import ข้อมูลนิสิต</h5>
          <pre className="mt-2">
            <code className="bg-gray-50 rounded-lg p-1">
              student_code,full_name,gmail,major
            </code>
          </pre>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={(tab) => setSelectedTab(tab as Tab)}
          className="min-w-0"
        >
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="file-uploader">
              Upload
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="editor">
              Editor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="file-uploader">
            <FileUploader
              onFileSelect={handleSelectFile}
              className="h-[300px]"
            />
          </TabsContent>
          <TabsContent value="editor">
            <Codemirror
              height="300px"
              value={rawContent}
              onChange={(val) => setRawContent(val)}
            />
          </TabsContent>
        </Tabs>
        <Button
          className="gap-4"
          onClick={handleImport}
          disabled={importUser.isPending}
        >
          {importUser.isPending && (
            <Loader size="1rem" className="animate-spin" />
          )}
          Import
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ImportUserDialog;
