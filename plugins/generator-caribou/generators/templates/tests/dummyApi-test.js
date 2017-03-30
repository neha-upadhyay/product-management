/*
v0.5 api test template
*/
import <%= apiName %> from '../<%= apiName %>';

describe('<%= apiName %>', () => {
  const endpoint = new <%= apiName %>().<%= apiActionCreatorFunctionName %>();
  
  it('should have proper endpoint', (done) => {
    endpoint.then((result) => {
      expect(result.url).toBe('<%= apiUrl %>');
      done();
    });
  });
});
