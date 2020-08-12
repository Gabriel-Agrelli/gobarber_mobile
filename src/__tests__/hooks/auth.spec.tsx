import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import AsyncStorage from '@react-native-community/async-storage';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-123',
        name: 'Jhon Doe',
        email: 'jhondoe@example.com',
      },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'jhondoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ['@GoBarber:token', apiResponse.token],
      ['@GoBarber:user', JSON.stringify(apiResponse.user)],
    ]);

    expect(result.current.user.email).toEqual('jhondoe@example.com');
  });
});
