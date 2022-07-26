/**
 *列表构建成树
 * @param {[{id:1,parentId:-1}]} list
 */
function ListToTree(list) {
  let roots = [],
    levelNodes = [];
  //先构建根数组
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId === -1) {
      let node = list.splice(i, 1)[0];
      i--;
      roots.push(node);
      levelNodes.push(node);
    }
  }

  while (list.length > 0) {
    let firstNode = levelNodes.shift();
    for (let j = 0; j < list.length; j++) {
      if (list[j].parentId == firstNode.id) {
        let node = list.splice(j, 1)[0];
        j--;
        if (firstNode.children) {
          firstNode.children.push(node);
        } else {
          firstNode.children = [node];
        }
        levelNodes.push(node);
      }
    }
  }
  return roots;
}

/**
 * 获得整颗树的 id数组 (包括传入的id)
 * @param {*} idArray
 * @param {*} parentNode
 */
function GetSubStreeIds(treeList, id) {
  let nodes = [],
    ids = [];
  let root = null;
  for (let i = 0; i < treeList.length; i++) {
    nodes.push(treeList[i]);
  }
  while (nodes.length > 0) {
    let curNode = nodes.pop();
    if (curNode.id == id) {
      root = curNode;
    } else {
      if (curNode.children) {
        for (let i = 0; i < curNode.children.length; i++) {
          nodes.push(curNode.children[i]);
        }
      }
    }
  }
  nodes = [];
  if (root) {
    nodes.push(root);
    while (nodes.length > 0) {
      let curNode = nodes.pop();
      ids.push(curNode.id);
      if (curNode.children) {
        for (let i = 0; i < curNode.children.length; i++) {
          nodes.push(curNode.children[i]);
        }
      }
    }
  }
  return ids;
}

function isPrivateIp(ip) {
  let reg =
    /^1(((0|27)(.(([1-9]?|1[0-9])[0-9]|2([0-4][0-9]|5[0-5])))|(72.(1[6-9]|2[0-9]|3[01])|92.168))(.(([1-9]?|1[0-9])[0-9]|2([0-4][0-9]|5[0-5]))){2})$/gi;
  return reg.test(ip);
}

module.exports = {
  ListToTree,
  GetSubStreeIds,
  isPrivateIp,
};
