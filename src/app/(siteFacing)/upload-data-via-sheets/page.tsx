import { isEditor } from "../auth/_actions/isAdmin";
import DataForm from "./_components/DataForm";

export default async function UploadData() {
  await isEditor();
  return (
    <div className="container flex items-center justify-center p-20">
      <DataForm />
    </div>
  );
}
