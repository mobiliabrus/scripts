testController.testModel.testDataArr.forEach((test) =>
  window.open(
    'https:' +
      pageData._currSiteUrl +
      pageData.pointTestUrl +
      '?pointTestID=' +
      test.pointID +
      '&cwID=' +
      pageData.cwID
  )
);
