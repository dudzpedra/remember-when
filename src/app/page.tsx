// import { cookies } from "next/headers";
// import { createClient } from '@/app/lib/supabase/server';
import MainLayout from './components/MainLayout';
import AlbumContent from './components/AlbumContent';
import NewMemoryForm from './components/NewMemoryForm';

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
    <MainLayout
      albumContent={<AlbumContent />}
      newMemoryContent={<NewMemoryForm />}
    />
  );
}
