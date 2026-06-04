// import { cookies } from "next/headers";
// import { createClient } from '@/app/lib/supabase/server';
import { Space } from "antd";
import MemoryCard from "./components/MemoryCard";
import PageHeader from "./components/PageHeader";

export default function Home() {
  // const cookieStore = await cookies();
  // const supabase = createClient(cookieStore);

  // const { data: memories, error } = await supabase.from('memories').select();
  // if (error) {
  //   console.error(error);
  // } else {
  //   console.log(memories);
  // }
  return (
    // <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
    //   </main>
    // </div>
    <Space 
      vertical 
      align="center"
      style={{ width: '100%', padding: '2rem' }}
    >
      <PageHeader />
      <MemoryCard />
    </Space>
  );
}
