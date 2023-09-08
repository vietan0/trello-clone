import supabase from '.';

async function rpcTest() {
  // const { data, error } = await supabase.rpc('get_all_boards', {
  //   user_id: '6bb317fb-3c38-47d7-a6d7-b1b9e9a13dc1',
  // });
  const { data, error } = await supabase.rpc('check_admin', {
    target_id: 'bfb33b16-7b1b-4e5a-8b9f-a0a692fd7484',
  });
  if (error) console.log('error thrown: ', error);
  console.log(data);
  return data;
}

// rpcTest();
