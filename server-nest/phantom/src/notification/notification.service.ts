import { Injectable } from '@nestjs/common';
import { ValidationService } from '../shared/validation.service';

import * as firebase from 'firebase-admin';

const params = {
  type: 'service_account',
  projectId: 'phantom-286304',
  privateKeyId: 'cf900f244489aa10a3e4287c2265467d2452c16f',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDK+yPqQ6u6xie5\ndT3LwhSbvC34Qw651BAzoBcA62RPBTFnkhj9rKgv9friolYO+MuBQtewBkTVwhpX\nefagJBe2zORUxs3mVt5JYqWBc51xQKnWhPJB15pC8KzSTtdoM0Uac7W2qQVmQWnD\nUEhSx2KxZnutbaleLehgowzfI4kAlLVJmTrQPTyatAASw2JD/GfWPIwpWrt+Re2q\nfpzLPTAc/g2uPFKfGd0CHflHwb//0skvjYz0luHKiNDMeVYyFRzpzBgBcIpEGwGi\n6PD1z1tHSNVaRPcl+ojpzPzuf6yJWK7cij+5ysiFNdPF745GRAZla0cgldLZ47aV\n7Kxt2NRJAgMBAAECggEAO9h42diS2NIUo0L0cc9qmRIN8az/uf1Su43fSmecnwm2\na8Vw9dYCjoV1L33SZr6m7ZkCE8V9ZRLCBnmQo92QWlalmXM2AMwq5LMfff/S8zGw\nAW4YKR6CvmrMYYNaUkAPh0GHWXATBfeSUcIpWLKtoAVJwLPc5EYfxeI86MtG2PL4\nSYfre4so4jAmyRgaZMWWFGrix+pj+9YCSy8Iuirsk3lF/ZYEsJREwjgpJWczFISD\n7tljWTedWtun4g/iK70681gH4pd9LQhDjYDnY9Ne8t+67pfiGopEgR+Xp20VT5fN\nD/nKR8aBmIwydCXedljUR+f7uBSLIVpUYGn6sAtjqwKBgQD61ViTMf1O0Hz7n0Op\nV1Cnu0lkujEW7PZhr9wM5dkHyqfclLEFp9LOXtULBMeZIXlMmfWJTFC0uFDnE27D\nJmObpOfH16QlY0ray9EUf4Y6vb8Ve2hFI3wgfAT6jsV9GfcT5/r6Ed2VD36IcHR8\n+n6K6UPGJwrdxokQm6EOC9x+wwKBgQDPKXeJqcEh1U2+/bY/eyKzO+gbyNdvcz4f\ndlCbLm4NFw6RuaR/CCg3UzeA8eWCqqh4VVHRy0cnz88DK770KhZirThEjJAzgZhA\n/xXV5OxGniGHxVWHSIq6jZBan7xZLFB49+1DKF6y1vi5NVJVKP1MQan58uG9po4y\nR4EzvinIAwKBgCt5lOuWS4BAlJkMJq8QKjOYO4VQ3DdMBPwzfeFiaTZ3gpax0ujX\nCKuqNiS9xFafPaXwPWV5q7dXBva2IImEetk8QMwbbSDpz8ySbP+vhrVhs9/mTtFE\n8Du1IyvGWSZwvKlfmNmFBTHTyKufSiFrTUmIWq3akICV66XMQ6LqnWH/AoGBALs7\nXy6snkFV586WwADf6ZzUqBN0kkHIhn0pEfEvJYfvLtvGTUYCuVZHgAKqniRa2ajo\nc+qJLuZsi0zyXMOQxmqo5BIQeMQUfOdBpRqMrH+mq+dqEsMSbU/uYmmFtVVjF9g9\nO9NWyUAZyvKZnrAZO9WQA3BEdIJT5nDK75s0Y87BAoGBAKcbyfkrVl6C3tTUe31M\nx1NLBxvsiyDAfiZGMUAbEf5QhB3HfmKzX3wSq+vf7HhPt1Uk38ZFr+NcF3E7hd1o\nh8LMoekWGzu8mY+8K+U3X1gtgbOZmMRVLqj+fU2KTobjzBcKZkXtA1XgWbcT/jiT\nJDUw6uIlL//LAAzqMvtzmcKo\n-----END PRIVATE KEY-----\n',
  clientEmail: 'phantom@phantom-286304.iam.gserviceaccount.com',
  clientId: '100690891016453659830',
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
  clientC509CertUrl:
    'https://www.googleapis.com/robot/v1/metadata/x509/phantom%40phantom-286304.iam.gserviceaccount.com',
};
let app = firebase.initializeApp({
  credential: firebase.credential.cert(params),
});
@Injectable()
export class NotificationService {
  constructor() { }
  async sendNotification(tokens, message) {
    const notSendTokens = [];
    app
      .messaging()
      .sendMulticast(message)
      .then(response => {
        if (response.failureCount > 0) {
          response.responses.forEach((res, id) => {
            if (!res.success) {
              notSendTokens.push(tokens[id]);
            }
          });
        } else {
          console.log('Message has been sent successfully');
        }
      });
    return notSendTokens;
  }

  async sendOfflineNotification(messages, fcmToken) {
    if (!messages || messages.length == 0) return;
    for (let i = 0; i < messages.length; i++) messages[i].token = fcmToken;

    app
      .messaging()
      .sendAll(messages)
      .then(response => {
        console.log(response.successCount + ' messages were sent successfully');
      });
  }

  async followUser(followedUser, followerUser) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        title: string;
        body: string;
        time: string;
      };
      tokens?: [string];
    } = {
      data: {
        followerImageId: String(followerUser.profileImage),
        followerId: String(followerUser._id),
        title: 'your follower increase ',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed You 😮',
        time: Date.now().toString(),
      },
    };
    console.log(message);
    followedUser.notificationCounter = followedUser.notificationCounter ? followedUser.notificationCounter + 1 : 1;
    await followedUser.save();

    if (!followedUser.notifications) followedUser.notifications = [];
    followedUser.notifications.push(message);
    console.log(followedUser.notifications);
    if (!followedUser.fcmToken || followedUser.fcmToken == ' ') {
      if (!followedUser.offlineNotifications)
        followedUser.offlineNotifications = [];
      followedUser.offlineNotifications.push(message);
      await followedUser.save();
      console.log(followedUser.offlineNotifications);
    } else {
      await followedUser.save();
      message.tokens = [followedUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [followedUser.fcmToken],
        message,
      );
      console.log(checkFailed);
      if (checkFailed) {
        message.tokens = null;
        followedUser.offlineNotifications.push(message);
      }
    }
    await followedUser.save();
    return 1;
  }
  async unfollowUser(followedUser, followerUser) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        followerImageId: String(followerUser.profileImage),
        followerId: String(followerUser._id),
        title: 'your follower increase ',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed You 😮',
      },
    };
    let notificationData = followedUser.offlineNotifications;
    for (let i = 0; followedUser.offlineNotifications.length; i++) {
      notificationData[i].data.time = undefined;
      if (message == notificationData[i]) {
        followedUser.offlineNotifications.splice(i, 1);
        await followedUser.offlineNotifications.save();
      }
    }
    notificationData = followedUser.notifications;
    for (let i = 0; followedUser.notifications.length; i++) {
      notificationData[i].data.time = undefined;
      if (message == notificationData[i]) {
        followedUser.notifications.splice(i, 1);
        await followedUser.save();
      }
    }
    return 1;
  }

  async followBoard(ownerUser, followerUser, boardName, boardId) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        boardId: string;
        title: string;
        body: string;
        time: string;
      };
      tokens?: [string];
    } = {
      data: {
        time: Date.now().toString(),
        followerImageId: String(followerUser.profileImage),
        followerId: String(followerUser._id),
        boardId: boardId,
        title: '😮 your board is followed',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed Your board ' +
          '"' +
          boardName +
          '"',
      },
    };
    ownerUser.notificationCounter = ownerUser.notificationCounter ? ownerUser.notificationCounter + 1 : 1;
    await ownerUser.save();
    if (!ownerUser.notifications) ownerUser.notifications = [];
    ownerUser.notifications.push(message);
    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications.push(message);
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed) {
        message.tokens = null;
        ownerUser.offlineNotifications.push(message);
      }
    }
    await ownerUser.save();
    return 1;
  }

  async commentPin(ownerUser, commenterUser, comment, pinName, pinId, imageId) {
    let message: {
      data: {
        time: string;
        commenterImageId: string;
        commenterId: string;
        imageLink: string;
        pinId: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        time: Date.now().toString(),
        commenterImageId: String(commenterUser.profileImage),
        commenterId: String(commenterUser._id),
        imageLink: 'http://localhost:3000/image/' + imageId,
        pinId: pinId,
        title: '📝 Comment on your pin',
        body:
          commenterUser.firstName +
          ' ' +
          commenterUser.lastName +
          ' has comment on your pin' +
          '"' +
          pinName +
          '"' +
          'say that' +
          comment,
      },
    };
    ownerUser.notificationCounter = ownerUser.notificationCounter ? ownerUser.notificationCounter + 1 : 1;
    await ownerUser.save();
    if (!ownerUser.notifications) ownerUser.notifications = [];
    ownerUser.notifications.push(message);
    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications.push(message);
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed) {
        message.tokens = null;
        ownerUser.offlineNotifications.push(message);
      }
      await ownerUser.save();
    }
    await ownerUser.save();
    return 1;
  }

  async reactPin(ownerUser, reactUser, pinName, pinId, react, imageId) {
    if (react == 'Love') react = '💖';
    else if (react == 'Good idea') react = '👍';
    else if (react == 'Thanks') react = '🙆‍♀️';
    else if (react == 'Haha') react = '😄';
    else if (react == 'Wow') react = '😮';

    let message: {
      data: {
        time: string;
        userImageId: string;
        userId: string;
        imageLink: string;
        pinId: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        time: Date.now().toString(),
        userImageId: String(reactUser.profileImage),
        userId: String(reactUser._id),
        imageLink: 'http://localhost:3000/image/' + imageId,
        pinId: pinId,
        title: react + ' React on your pin',
        body:
          reactUser.firstName +
          ' ' +
          reactUser.lastName +
          ' has react on your pin' +
          '"' +
          pinName +
          '"',
      },
    };
    ownerUser.notificationCounter = ownerUser.notificationCounter ? ownerUser.notificationCounter + 1 : 1;
    await ownerUser.save();
    if (!ownerUser.notifications) ownerUser.notifications = [];
    ownerUser.notifications.push(message);
    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications.push(message);
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed) {
        message.tokens = null;
        ownerUser.offlineNotifications.push(message);
      }
      await ownerUser.save();
    }
    await ownerUser.save();
    return 1;
  }

  async boardsForYou(user, boards, images) {
    let arrayMessage = {
      boards: boards,
      images: images,
      time: Date.now(),
      title: 'Boards For You!',
      body: 'we think that you may get interested in some of these boards',
    };
    let message: {
      data: {
        boards: string;
        images: string;
        time: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        boards: boards.toString(),
        images: images.toString(),
        time: Date.now().toString(),
        title: 'Boards For You!',
        body: 'we think that you may get interested in some of these boards',
      },
    };
    user.notificationCounter = user.notificationCounter ? user.notificationCounter + 1 : 1;
    await user.save();
    if (!user.notifications) user.notifications = [];
    user.notifications.push(arrayMessage);
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message.tokens = [user.fcmToken];
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed) {
        let last = user.notifications.pop();
        if (String(last.data.title) != String(arrayMessage.title)) {
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }

    await user.save();
    return 1;
  }

  async popularPins(user, pins, images) {
    let arrayMessage = {
      pins: pins,
      images: images,
      title: 'Popular Phantom Pins!',
      time: Date.now(),
      body: 'check out these popular pins on phantom',
    };
    let message: {
      data: {
        pins: string;
        images: string;
        time: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        pins: pins.toString(),
        images: images.toString(),
        title: 'Popular Phantom Pins!',
        time: Date.now().toString(),
        body: 'check out these popular pins on phantom',
      },
    };
    user.notificationCounter = user.notificationCounter ? user.notificationCounter + 1 : 1;
    await user.save();
    if (!user.notifications) user.notifications = [];
    user.notifications.push(arrayMessage);
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message.tokens = [user.fcmToken];
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed) {
        let last = user.notifications.pop();
        if (String(last.data.title) != String(arrayMessage.title)) {
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }
  async pinsForYou(user, pins, images) {
    let arrayMessage = {
      pins: pins,
      images: images,
      time: Date.now(),
      title: 'Pins For You!',
      body: 'We think that you may get instersted in some of these pins',
    };
    let message: {
      data: {
        pins: string;
        time: string;
        images: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        pins: pins.toString(),
        images: images.toString(),
        time: Date.now().toString(),
        title: 'Pins For You!',
        body: 'We think that you may get instersted in some of these pins',
      },
    };
    user.notificationCounter = user.notificationCounter ? user.notificationCounter + 1 : 1;
    await user.save();
    if (!user.notifications) user.notifications = [];
    user.notifications.push(arrayMessage);
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message.tokens = [user.fcmToken];
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed) {
        let last = user.notifications.pop();
        if (String(last.data.title) != String(arrayMessage.title)) {
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }
  async pinsInspired(user, pins, images) {
    let arrayMessage = {
      pins: pins,
      images: images,
      time: Date.now(),
      title: 'Pins Inspired By Your Recent Activity!',
      body: 'check out these pins',
    };
    let message: {
      data: {
        pins: string;
        images: string;
        time: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        pins: pins.toString(),
        images: images.toString(),
        time: Date.now().toString(),
        title: 'Pins Inspired By Your Recent Activity!',
        body: 'check out these pins',
      },
    };
    user.notificationCounter = user.notificationCounter ? user.notificationCounter + 1 : 1;
    await user.save();
    if (!user.notifications) user.notifications = [];
    user.notifications.push(arrayMessage);
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message.tokens = [user.fcmToken];
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed) {
        let last = user.notifications.pop(message);
        if (String(last.data.title) != String(arrayMessage.title)) {
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }
}
