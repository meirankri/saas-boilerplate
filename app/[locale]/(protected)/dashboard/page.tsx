import HasAuthorizationServer from "@/components/auth/HasAutorizationServer";
import IsForbidenServer from "@/components/auth/IsForbidenServer";
import ProductPage from "@/components/TestGeneration";
import UserQuotaFeatures from "@/components/quota/UserQuotaFeatures";
import { FileUploadWrapper } from "@/components/FileUpload/FileUploadWrapper";
import { FileList } from "@/components/FileList/FileList";
import { db } from "@/lib/database/db";
import { validateSession } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateSession();
  if (!user) {
    redirect("/sign-in");
  }

  // Récupérer les documents de l'utilisateur
  const documents = await db.document.findMany({
    where: {
      createdBy: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HasAuthorizationServer plans={["Premium"]}>
        <div className="bg-red-500 p-4">This is a premium content</div>
      </HasAuthorizationServer>
      <UserQuotaFeatures />
      <ProductPage params={{ productName: "product_link_builder" }} />

      <HasAuthorizationServer plans={["Basic plus"]}>
        <div className="bg-red-500 p-4">This is a basic plus content</div>
      </HasAuthorizationServer>

      <IsForbidenServer plans={["Premium"]}>
        <div className="bg-red-500 p-4">your have not the premium plan</div>
      </IsForbidenServer>

      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Téléverser un fichier</h2>
          <FileUploadWrapper entityId={user.id} entityType="user" />
        </div>

        <FileList initialDocuments={documents} />
      </div>
    </main>
  );
}
