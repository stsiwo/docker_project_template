import * as React from 'react'
import { UseRequestStatusInputType, UseRequestStatusOutputType, RequestStatusType, FetchDataArgType, CacheData } from "./types";
import { AxiosError, CancelTokenSource } from 'axios';
import { ResponseResultStatusEnum, ResponseResultType, RequestMethodEnum } from 'requests/types';
import { request, getCancelTokenSource } from 'requests/request';
import { buildQueryString, getTimeOneHourAfter } from '../../../../utils';
import { useAuthContext } from 'Contexts/AuthContext/AuthContext';
import { getCachedData } from './caches'
import serialize from 'serialize-javascript';
import { logger } from 'configs/logger';
const log = logger("FetchStatus");


export const useRequest = (input: UseRequestStatusInputType): UseRequestStatusOutputType => {

  const [currentRequestStatus, setRequestStatus] = React.useState<RequestStatusType>({
    status: ResponseResultStatusEnum.INITIAL
  })

  const { authDispatch } = useAuthContext()

  const [currentCancelSource, setCancelSource] = React.useState<CancelTokenSource>(null)

  async function sendRequest(args: FetchDataArgType) {
    log('start handling fetch data function')
    log(args)
    // set default value
    args.useCache = (args.useCache === undefined) ? true : false
    args.allowCache = (args.allowCache === undefined) ? true : false

    setRequestStatus({
      status: ResponseResultStatusEnum.FETCHING,
    })
    const cancelTokenSource = getCancelTokenSource()
    setCancelSource(cancelTokenSource)

    // return cached and not send request if useCache and cache is available and only GET method
    if (args.useCache && args.method === RequestMethodEnum.GET) {
      log(" useCache is enabled ")
      const cachedData = getCachedData(args.path + buildQueryString(args.queryString))
      if (cachedData) {
        log(" cachedData is available ")
        const responseCacheResult: ResponseResultType = {
          data: cachedData,
          status: ResponseResultStatusEnum.SUCCESS
        }
        setRequestStatus(responseCacheResult)
        return Promise.resolve(responseCacheResult)
      }
    }

    return await request({
      url: args.path + buildQueryString(args.queryString),
      ...(args.method && { method: args.method }),
      ...(args.headers && { headers: args.headers }),
      ...(args.data && { data: args.data }),
      cancelToken: cancelTokenSource.token
    })
      .then((responseResult: ResponseResultType) => {
        log('fetch data function receive response successfully')
        setRequestStatus(responseResult)

        if (args.allowCache) {
          /**
           * cache response 
           *  - set expire at current time + 1 hour
           **/
          log("start caching response data")
          localStorage.setItem(args.path + buildQueryString(args.queryString), serialize(({
            // set expireAt: + 1 hours when recive response
            expireAt: getTimeOneHourAfter(),
            data: responseResult.data
          } as CacheData)))
        }

        /**
         * return promise with responseResult
         *  - avoid using 'callback'
         **/
        return Promise.resolve(responseResult)
      })
      .catch((result: ResponseResultType) => {
        log('fetch data then clause failed at sendRequest')
        /** this is called when above 'then' caluse failed **/
        /** or 'request' function reject promise **/

        /** logout if error type is 401 (ACCESS_AND_REFRESH_TOKEN_EXIPRED and INVALID_TOKEN) **/
        if (result.needLogout) {
          authDispatch({
            type: 'logout'
          })
        }

        setRequestStatus(result)
        return Promise.resolve(result)
      })
  }

  return {
    currentRequestStatus: currentRequestStatus,
    setRequestStatus: setRequestStatus,
    sendRequest: sendRequest,
    currentCancelSource: currentCancelSource
  }
}



