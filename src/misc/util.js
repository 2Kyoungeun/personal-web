// 데이터의 'undefined' 값을 제거
const sanitizeObject = (obj) => {
    const result = Object.entries(obj).reduce((map, [key, value]) => {
      if (value !== undefined) {
        map[key] = value;
      }
      return map;
    }, {});
    return result;
};
  
// 응답 객체를 생성하는 함수
const buildResponse = (data, errorMessage) => ({
    error: errorMessage ?? null,
    data,
});

export {
    sanitizeObject,
    buildResponse
};