import supabase from '.';

// available RPC functions:
// https://supabase.com/dashboard/project/sovkuuwtdjoynaeggshs/database/functions

async function rpcTest() {
  // const { data, error } = await supabase.rpc('log_user_info');
  // if (error) console.log('error thrown: ', error);
  // const { uid } = data[0];
  // const { data: getAllBoardsData, error: getAllBoardsError } = await supabase.rpc('get_all_boards', {
  //   user_id: uid,
  // });
  // console.log('getAllBoards data', getAllBoardsData);

  const { data, error } = await supabase.rpc('custom_return_type');
  console.log('custom_return_type() result', data)
  return data;
}

rpcTest();
