import supabase from '.';

async function rpcTest() {
  const { data, error } = await supabase.rpc('sayhi');
  if (error) console.log('error thrown: ', error);
  console.log(data);
  return data;
}

// rpcTest();
