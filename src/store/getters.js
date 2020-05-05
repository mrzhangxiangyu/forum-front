const getters = {
  device: state => state.app.device,
  search: state => state.app.search,
  avatar: state => state.user.avatar,
  nickname: state => state.user.nickname,
  userId: state => state.user.userId
}
export default getters
