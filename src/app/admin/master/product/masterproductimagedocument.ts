// if (productForm) {
      //   productForm.append('product_id', productId),
      //   productForm.append('product_name', this.productForm.value.product_name),
      //   productForm.append('product_technical_name', this.productForm.value.product_technical_name),
      //   productForm.append('product_form', this.productForm.value.product_form),
      //   productForm.append('product_description', this.productForm.value.product_description),
      //   productForm.append('product_image', this.productDocumentForm.value.product_image, productId + '.png'),
      //   productForm.append('product_document', this.productDocumentForm.value.product_document, productId),
      //   productForm.append('session_id', localStorage.getItem('session_id')),
      //   productForm.append('created_date', this.global.getDateZone()),
      //   productForm.append('created_time', this.global.getTimeZone())
      //   this.productService.createProductWithImageDocument(productForm).subscribe((productDocument: any) => {
      //     let category = {
      //       'product_id': productDocument.data.product_id,
      //       'category_id': category_id,
      //       'session_id': localStorage.getItem('session_id'),
      //       'created_date': this.global.getDateZone(),
      //       'created_time': this.global.getTimeZone()
      //     }
      //     this.productService.createProductCategory(category).subscribe((createCategory) => {
      //       raw_material_id.map((d, index) => {
      //         let raw_material = {
      //           'product_id': productDocument.data.product_id,
      //           'raw_material_id': raw_material_id[index],
      //           'session_id': localStorage.getItem('session_id'),
      //           'created_date': this.global.getDateZone(),
      //           'created_time': this.global.getTimeZone()
      //         }
      //         this.productService.createProductRawMaterial(raw_material).subscribe((createRawMaterial) => {
      //           this.productService.getProduct().subscribe((getProduct: any) => {
      //             this.arr_product_data = this.global.tableIndex(getProduct.data);
      //             this.isProgressBar = false;
      //             if (this.arr_product_data.length > 0) {
      //               this.is_data = false;
      //               this.is_table = true;
      //             } else if (this.arr_product_data.length === 0) {
      //               this.is_table = false;
      //               this.is_data = true;
      //             }
      //           })
      //         })
      //       })
      //     })
      //     this.productService.getProduct().subscribe((getProduct: any) => {
      //       this.arr_product_data = this.global.tableIndex(getProduct.data);
      //       this.isProgressBar = false;
      //       if (getProduct['success']) {
      //         this.is_data = false;
      //         this.is_table = true;
      //       } else if (!getProduct['success']) {
      //         this.is_table = false;
      //         this.is_data = true;
      //       }
      //     })
      //   })
      // }
      // product details wothout image or document