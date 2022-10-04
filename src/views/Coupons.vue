<template>
  <div>
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, key) in coupons" :key="key">
        <td>{{ item.title }}</td>
        <td>{{ item.percent }}%</td>
        <td>{{ $filters.date(item.due_date) }}</td>
        <td>
          <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
          <span v-else class="text-muted">未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm"
                    @click="openCouponModal(false, item)"
            >編輯</button>
            <button class="btn btn-outline-danger btn-sm"
                    @click="openDelCouponModal(item)"
            >刪除</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <CouponModal :coupon="tempCoupon" :is-new="isNew" ref="couponModal"
    @update-coupon="updateCoupon"/>
    <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon"/>
  </div>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';

// function pushMessageState(response, title = '更新') {
//   if (response.data.success) {
//     this.emitter.emit('push-message', {
//       style: 'success',
//       title: `${title}成功`,
//     });
//   } else {
//     this.emitter.emit('push-message', {
//       style: 'danger',
//       title: `${title}失敗`,
//       content: response.data.message.join('、'),
//     });
//   }
// }

export default {
  components: { CouponModal, DelModal },
  props: {
    config: Object,
  },
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
      },
      isLoading: false,
      isNew: false,
    };
  },
  methods: {
    openCouponModal(isNew, item) {
      this.isNew = isNew;
      if (this.isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
        };
      } else {
        this.tempCoupon = { ...item };
      }
      this.$refs.couponModal.openModal();
    },
    openDelCouponModal(item) {
      this.tempCoupon = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.openModal();
    },
    getCoupons() {
      this.isLoading = true;
      const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupons`;
      this.$http.get(url, this.tempProduct).then((response) => {
        this.coupons = response.data.coupons;
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        this.$httpMessageState(error.response, '錯誤訊息');
      });
    },
    updateCoupon(tempCoupon) {
      this.isLoading = true;
      let url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupon`;
      let httpMethos = 'post';
      let data = tempCoupon;

      if (!this.isNew) {
        url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
        httpMethos = 'put';
        data = this.tempCoupon;
      }

      this.$http[httpMethos](url, { data }).then((response) => {
        this.isLoading = false;
        this.$httpMessageState(response, '新增優惠券');
        this.getCoupons();
        this.$refs.couponModal.hideModal();
      }).catch((error) => {
        this.isLoading = false;
        this.$httpMessageState(error.response, '錯誤訊息');
      });
    },
    delCoupon() {
      const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.isLoading = true;
      this.$http.delete(url).then((response) => {
        this.isLoading = false;
        this.$httpMessageState(response, '刪除優惠券');
        const delComponent = this.$refs.delModal;
        delComponent.hideModal();
        this.getCoupons();
      }).catch((error) => {
        this.isLoading = false;
        this.$httpMessageState(error.response, '刪除優惠券');
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
