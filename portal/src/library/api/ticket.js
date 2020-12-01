/**
 * 工单服务相关http接口
 * @module ticket.js
 */
import request from '@/library/js/request'

export function none_plan_start(flow_id) {
  /**
   * 发起需要的数据
   */
  return request({
    url: '/rpcgateway/TicketService/plan_start_by_none',
    method: 'get',
    params: {
      'flow_id': flow_id
    }
  })
}

export function none_start(flow_id, initiator, forms) {
  /**
   * 空节点启动
   * @param flow_id
   * @param initiator 发起人openid
   * @param forms 提交的表单信息
   */
  return request({
    url: '/rpcgateway/TicketService/start_by_none',
    method: 'post',
    data: {
      'flow_id': flow_id,
      'initiator': initiator,
      'forms': forms
    },
    headers: { signature: true }
  })
}

export function ticket_backlog(text, page_index, page_size) {
  /**
   * 任务列表
   */
  return request({
    url: '/rpcgateway/TicketService/backlog',
    method: 'get',
    params: {
      'text': text,
      'page_index': page_index,
      'page_size': page_size
    }
  })
}

export function plan_ticket_deal(ticket_id, task_id) {
  /**
   * 事务处理
   */
  return request({
    url: '/rpcgateway/TicketService/plan_deal_ticket',
    method: 'get',
    params: {
      'ticket_id': ticket_id,
      'task_id': task_id
    }
  })
}

export function ticket_deal(ticket_id, task_id, forms, late_id) {
  /**
   * 事务处理数据提交
   */
  return request({
    url: '/rpcgateway/TicketService/deal_ticket',
    method: 'post',
    data: {
      'ticket_id': ticket_id,
      'task_id': task_id,
      'forms': forms,
      'late_id': late_id
    }
  })
}

export function plan_ticket_view(ticket_id) {
  /**
   * 查看任务
   */
  return request({
    url: '/rpcgateway/TicketService/plan_view_ticket',
    method: 'get',
    params: {
      'ticket_id': ticket_id
    }
  })
}

export function initiated_ticket(text, page_index, page_size, page) {
  /**
   * 我发起的工单
   */
  return request({
    url: '/rpcgateway/TicketService/initiated',
    method: 'get',
    params: {
      'text': text,
      'page_index': page_index,
      'page_size': page_size,
      'page': page
    }
  })
}

export function participate_ticket(text, page_index, page_size, page) {
  /**
   * 我参与的工单
   */
  return request({
    url: '/rpcgateway/TicketService/participate',
    method: 'get',
    params: {
      'text': text,
      'page_index': page_index,
      'page_size': page_size,
      'page': page
    }
  })
}

export function finished_ticket(text, page_index, page_size, page) {
  /**
   * 已结束的工单
   */
  return request({
    url: '/rpcgateway/TicketService/finished',
    method: 'get',
    params: {
      'text': text,
      'page_index': page_index,
      'page_size': page_size,
      'page': page
    }
  })
}

export function action_do(data) {
  /**
   * 按钮提交相应操作
   * @param ticket_id 工单ID
   * @param action 操作
   * @param forms 表单数据
   * @param owner_id 所属ID，节点ID or 流程ID
   * @param task_id 页面正在处理的任务，为空则没有处理
   */
  return request({
    url: '/rpcgateway/TicketService/do_action',
    method: 'post',
    data: data
  })
}

export function comment_add(ticket_id, comment, parent_id, object) {
  /**
   * 添加评论
   * @param ticket_id 工单ID
   * @param comment 评论内容，字典格式 {com: {comment: ''}}
   * @param parent_id 父记录ID
   * @param object 表单元信息 {}
   */
  return request({
    url: '/rpcgateway/TicketService/add_comment',
    method: 'post',
    data: {
      'ticket_id': ticket_id,
      'comment': comment,
      'parent_id': parent_id,
      'object': object
    }
  })
}
