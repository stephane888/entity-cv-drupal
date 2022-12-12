import store from "./index";
import request from "../request";
import { limit } from "stringz";

export default {
  ...request,
  /**
   * Entité drupal domain_ovh_entity
   */
  domain_ovh_entity: {},
  /**
   * Entité drupal domain
   */
  domainRegister: {},
  /**
   * --
   */
  homePageCv: {},
  currentBuildStep: 0,
  timeWaitRun: 600,
  OrtherPages: [],
  messages: { errors: [], warnings: [] },
  runStep(steps, state) {
    console.log(" currentBuildStep : ", this.currentBuildStep);
    // On recupere
    var getDataStep = () => {
      if (steps[this.currentBuildStep]) {
        return steps[this.currentBuildStep];
      }
      return null;
    };
    var step = getDataStep();
    if (step)
      switch (step.step) {
        case "create_domaine":
          step.status = "run";
          this.CreateEntitiesForDomaine()
            .then((result) => {
              this.domain_ovh_entity = result.data;
              setTimeout(() => {
                step.status = "ok";
                this.currentBuildStep++;
                this.runStep(steps, state);
              }, this.timeWaitRun);
            })
            .catch((resp) => {
              step.status = "error";
              this.runErrorsMessages(resp);
            });
          break;
        case "register_domaine":
          step.status = "run";
          this.RegisterDomaine()
            .then((result) => {
              this.domainRegister = result.data.domain;
              // On lance la creation sur OVH, apres cette etape.(car les deux etapes modifie la meme entité)
              if (
                this.domain_ovh_entity.id &&
                this.domain_ovh_entity.id[0] &&
                this.domain_ovh_entity.id[0].value
              )
                this.bPost(
                  "/ovh-api-rest/create-domaine/" +
                    this.domain_ovh_entity.id[0].value
                ).catch(() => {
                  this.messages.warnings.push(
                    " Votre domaine n'a pas pu etre generer "
                  );
                });
              else
                this.messages.warnings.push(
                  " L'entité du domaine n'a pas pu etre creer "
                );
              if (this.domainRegister.hostname) {
                store.commit("SET_HOSTNAME", {
                  domain: this.domainRegister.hostname,
                  scheme: this.domainRegister.scheme,
                });
              }
              setTimeout(() => {
                step.status = "ok";
                this.currentBuildStep++;
                this.runStep(steps, state);
              }, this.timeWaitRun);
            })
            .catch((resp) => {
              step.status = "error";
              this.runErrorsMessages(resp);
            });
          break;
        case "create_content":
          step.status = "run";
          this.CreateContents(state)
            .then((resp) => {
              this.homePageCv = resp.data;
              setTimeout(() => {
                step.status = "ok";
                this.currentBuildStep++;
                this.runStep(steps, state);
              }, this.timeWaitRun);
            })
            .catch((resp) => {
              step.status = "error";
              this.runErrorsMessages(resp);
            });
          break;
        case "create_theme":
          step.status = "run";
          this.CreateTheme()
            .then(() => {
              setTimeout(() => {
                step.status = "ok";
                this.currentBuildStep++;
                this.runStep(steps, state);
              }, 500);
            })
            .catch((resp) => {
              step.status = "error";
              this.runErrorsMessages(resp);
            });
          break;
        case "layout_header":
          step.status = "run";
          if (this.domainRegister.id) {
            this.createBlockContentHeader(state)
              .then((resp) => {
                var passNext = () => {
                  setTimeout(() => {
                    step.status = "ok";
                    this.currentBuildStep++;
                    this.runStep(steps, state);
                  }, 500);
                };
                this.addEntityToBlock(resp.data, "top_header")
                  .then(() => {
                    passNext();
                  })
                  .catch(() => {
                    passNext();
                  });
              })
              .catch((resp) => {
                step.status = "error";
                this.runErrorsMessages(resp);
              });
          } else {
            step.status = "error";
            this.currentBuildStep++;
            this.runStep(steps, state);
          }
          break;
        case "layout_footer":
          step.status = "run";
          if (this.domainRegister.id) {
            this.createBlockContentFooter(state)
              .then((resp) => {
                var passNext = () => {
                  setTimeout(() => {
                    step.status = "ok";
                    this.currentBuildStep++;
                    this.runStep(steps, state);
                  }, 500);
                };
                this.addEntityToBlock(resp.data, "footer")
                  .then(() => {
                    passNext();
                  })
                  .catch(() => {
                    passNext();
                  });
              })
              .catch((resp) => {
                step.status = "error";
                this.runErrorsMessages(resp);
              });
          } else {
            step.status = "error";
            this.currentBuildStep++;
            this.runStep(steps, state);
          }
          break;
        case "generate_style":
          step.status = "run";
          if (this.domainRegister.id) {
            var passNext = () => {
              setTimeout(() => {
                step.status = "ok";
                this.currentBuildStep++;
                this.runStep(steps, state);
              }, 500);
            };
            this.generateStyleTheme()
              .then(() => {
                passNext();
              })
              .catch(() => {
                passNext();
              });
          } else {
            step.status = "error";
            this.currentBuildStep++;
            this.runStep(steps, state);
          }
          break;
        default:
          // on ne devrait pas arrivé ici.
          this.messages.warnings.push(
            " Cette etape n'est pas definit : " + step.step
          );
          step.status = "ok";
          this.currentBuildStep++;
          this.runStep(steps, state);
          break;
      }
    // Execution terminée.
    else {
      store.commit("ACTIVE_FINISH");
      store.commit("storeForm/CLEAN_LOCALSTORAGE");
      this.runWarningsMessages();
    }
  },
  /**
   * Dans cette etape, on cree les entites "domain_ovh_entity" et domain.
   * @returns
   */
  CreateEntitiesForDomaine() {
    return new Promise((resolv, reject) => {
      store
        .dispatch("getSubDomain")
        .then((SubDomain) => {
          this.bPost("/generate-domain-vps/generate/" + SubDomain)
            .then((r) => {
              resolv(r);
            })
            .catch((er) => {
              reject(er);
            });
        })
        .catch((er) => {
          reject(er);
        });
    });
  },

  // On enregistre le domaine sur OVH et on l'enregistre egalement comme multidomaine sur drupal.
  RegisterDomaine() {
    return new Promise((resolv, reject) => {
      if (
        this.domain_ovh_entity.id &&
        this.domain_ovh_entity.id[0] &&
        this.domain_ovh_entity.id[0].value
      ) {
        // Cree l'entité domain s'il n'existe pas et recupere les entites domain et domain_ovh_entity.
        resolv(
          this.bPost(
            "/vuejs-entity/domaine/add/" + this.domain_ovh_entity.id[0].value
          )
        );
      } else {
        reject(" Le nom de domaine n'a pas pu etre creer ");
      }
    });
  },
  // On va cree la page d'accueil en function de l'identifiant present dans l'url.
  CreateContents(state) {
    return new Promise((resolv, reject) => {
      const presentaton = () => {
        state.storeForm.presentaton.model.field_domain_access = [
          { target_id: this.domainRegister.id },
        ];
        state.storeForm.presentaton.model.field_domain_source = [
          { target_id: this.domainRegister.id },
        ];
        return this.bPost(
          "/vuejs-entity/entity/save-duplicate-ref/paragraph",
          state.storeForm.presentaton.model
        );
      };
      const experience = () => {
        state.storeForm.experience.model.field_domain_access = [
          { target_id: this.domainRegister.id },
        ];
        state.storeForm.experience.model.field_domain_source = [
          { target_id: this.domainRegister.id },
        ];
        return this.bPost(
          "/vuejs-entity/entity/save-duplicate-ref/paragraph",
          state.storeForm.experience.model
        );
      };
      const formation = () => {
        state.storeForm.formation.model.field_domain_access = [
          { target_id: this.domainRegister.id },
        ];
        state.storeForm.formation.model.field_domain_source = [
          { target_id: this.domainRegister.id },
        ];
        return this.bPost(
          "/vuejs-entity/entity/save-duplicate-ref/paragraph",
          state.storeForm.formation.model
        );
      };
      // for layout_paragraphs
      const promises = [];
      for (const i in state.storeForm.layout_paragraphs) {
        promises.push(
          new Promise((resolv, reject) => {
            state.storeForm.layout_paragraphs[i].model.field_domain_access = [
              { target_id: this.domainRegister.id },
            ];
            state.storeForm.layout_paragraphs[i].model.field_domain_source = [
              { target_id: this.domainRegister.id },
            ];
            this.bPost(
              "/vuejs-entity/entity/save-duplicate-ref/paragraph",
              state.storeForm.layout_paragraphs[i].model
            )
              .then((resp) => {
                resolv({ target_id: resp.data.id[0].value });
              })
              .catch((er) => {
                reject(er);
              });
          })
        );
      }

      //
      const idHome = window.location.pathname.split("/").pop();
      let nom = store.getters.GetNom;
      let prenom = store.getters.GetPreNom;
      const title =
        nom || prenom
          ? " Curriculum Vitae (CV) de " + nom + " " + prenom
          : " Curriculum Vitae (CV) ";
      //
      const values = {
        name: [{ value: title }],
        field_domain_access: [{ target_id: this.domainRegister.id }],
        field_domain_source: [{ target_id: this.domainRegister.id }],
      };
      presentaton()
        .then((resp) => {
          values["presentation"] = [{ target_id: resp.data.id[0].value }];
          experience()
            .then((res) => {
              values["experience"] = [{ target_id: res.data.id[0].value }];
              formation()
                .then((re) => {
                  values["formation"] = [{ target_id: re.data.id[0].value }];
                  Promise.all(promises).then((vals) => {
                    values["layout_paragraphs"] = vals;
                    resolv(
                      this.bPost(
                        "/buildercv/entity/generate-cv/" + idHome,
                        values
                      )
                    );
                  });
                })
                .catch((er) => {
                  reject(er);
                });
            })
            .catch((er) => {
              reject(er);
            });
        })
        .catch((er) => {
          reject(er);
        });
    });
  },
  //
  CreateTheme() {
    return new Promise((resolv, reject) => {
      let nom = store.getters.GetNom;
      let prenom = store.getters.GetPreNom;
      var values = {
        site_config: [
          {
            value: JSON.stringify({
              "edit-config":
                "domain.config." + this.domainRegister.id + ".system.site",
              "page.front":
                this.homePageCv.id && this.homePageCv.id[0]
                  ? "/cv-entity/" + this.homePageCv.id[0].value
                  : "",
              name: nom || prenom ? prenom + " " + nom : " Cv ",
              "page.404": "",
              "page.403": "",
            }),
          },
        ],
        // il faut definir un logo, par defaut.
        // logo:
        //   this.donneeInternetEntity.image_logo &&
        //   this.donneeInternetEntity.image_logo.length
        //     ? this.donneeInternetEntity.image_logo
        //     : [],
        run_npm: [{ value: false }],
      };
      //
      if (this.domainRegister.id) {
        values["hostname"] = [{ value: this.domainRegister.id }];
      }
      // Applis colors
      // this.ApplieColor(values).then((resp) => {
      //   resolv(
      //     this.bPost("/vuejs-entity/entity/save/config_theme_entity", resp)
      //   );
      // });
      this.bPost("/vuejs-entity/entity/save/config_theme_entity", values)
        .then((resp) => {
          resolv(resp);
        })
        .catch((er) => {
          reject(er);
        });
    });
  },
  //
  createBlockContentHeader(state) {
    return new Promise((resolv, reject) => {
      console.log(" state.storeForm : ", state.storeForm);
      state.storeForm.entete_paragraph.model.field_domain_access = [
        { target_id: this.domainRegister.id },
      ];
      state.storeForm.entete_paragraph.model.field_domain_source = [
        { target_id: this.domainRegister.id },
      ];
      // Requis car le contenu de la page d'accueil ne s'active pas toujours.
      this.addDefaultBlockInRegion();
      this.CreateMenus(state)
        .then(() => {
          resolv(
            this.bPost(
              "/vuejs-entity/entity/add-paragrph-in-entity/block_content/header",
              {
                paragraph: state.storeForm.entete_paragraph.model,
                entity: {
                  info: [{ value: "Entete" }],
                  field_domain_access: [{ target_id: this.domainRegister.id }],
                  field_domain_source: [{ target_id: this.domainRegister.id }],
                },
              }
            )
          );
        })
        .catch((er) => {
          console.log("CreateMenus : ", er);
          reject();
        });
    });
  },

  /**
   * -
   */
  addDefaultBlockInRegion() {
    // Add default content region
    const id_system = limit("mainpagecontent" + this.domainRegister.id, 30, "");
    const system_main_block = {
      id: id_system,
      theme: this.domainRegister.id,
      region: "content",
      plugin: "system_main_block",
      status: true,
      visibility: {
        domain: {
          id: "domain",
          negate: false,
          context_mapping: {
            domain: "@domain.current_domain_context:domain",
          },
          domains: {
            [this.domainRegister.id]: this.domainRegister.id,
          },
        },
      },
      settings: {
        id: id_system,
        label: this.domainRegister.id + " : contenu principal",
        label_display: false,
        provider: "system",
      },
      weight: 0,
    };
    return this.bPost(
      "/vuejs-entity/entity/add-block-in-region",
      system_main_block
    );
  },

  /**
   * La creation de menu se fait apres la creation des pages.
   * Car les liens de pages ainsi generer devront etre utiliser comme lien.
   * @returns
   */
  CreateMenus(state) {
    return new Promise((resolv, reject) => {
      // Build menu :
      const menu = {
        //this.domain_ovh_entity.sub_domain[0].value contient a-z0-9,
        id: this.domain_ovh_entity.sub_domain[0].value + "_main",
        label: this.domainRegister.id + ": menu principal",
        description: "Menu generé automatiquement",
      };
      // Build items.
      const items = [];
      this.OrtherPages.forEach((page) => {
        if (page.id[0] && page.id[0].value)
          items.push({
            title: [
              {
                value: page.name[0]
                  ? page.name[0].value
                  : "lien genere :" + page.id[0].value,
              },
            ],
            enabled: [{ value: true }],
            link: [{ uri: "internal:/cv-entity/" + page.id[0].value }],
          });
      });
      // Contruit le menus et les items.
      this.bPost("/vuejs-entity/entity/add-menu-items", {
        menu: menu,
        items: items,
        domain: {
          field_domain_access: this.domainRegister.id,
          field_domain_source: this.domainRegister.id,
        },
        // block_content_type: "header_footer", // La construction doit etre statique car il ya un mappage de champs à faire.
      })
        .then((resp) => {
          console.log("resp : ", resp);
          if (resp.data.menu && resp.data.menu.id) {
            // On met à jour le champs "field_reference_menu" au niveau de l'object du header
            state.storeForm.entete_paragraph.model.field_reference_menu = [
              { target_id: resp.data.menu.id },
            ];
            resolv();
          } else {
            this.messages.warnings.push(
              " Une erreur est survenu lors de la disposition des menus, vous pourriez le faire plus tard. "
            );
            reject();
          }
        })
        .catch((er) => {
          this.messages.warnings.push(
            " Une erreur est survenu lors de la creation des menus, vous pourriez le faire plus tard. "
          );
          reject(er);
        });
    });
  },
  /**
   *
   * @param {*} blockContent
   */
  addEntityToBlock(blockContent, region) {
    return new Promise((resolv, reject) => {
      console.log(" addEntityToBlock : ", blockContent);
      if (blockContent["uuid"]) {
        const type = blockContent["type"][0]["target_id"];
        const uuid = blockContent["uuid"][0]["value"];
        const label = blockContent["info"][0]["value"];
        const id_domaine = limit(this.domainRegister.id, 20, "");
        const id_system = limit(id_domaine + type, 30, "");
        const values = {
          id: id_system,
          theme: this.domainRegister.id,
          region: region,
          plugin: "block_content:" + uuid,
          status: true,
          visibility: {
            domain: {
              id: "domain",
              negate: false,
              context_mapping: {
                domain: "@domain.current_domain_context:domain",
              },
              domains: {
                [this.domainRegister.id]: this.domainRegister.id,
              },
            },
          },
          settings: {
            id: id_system,
            label: label,
            label_display: false,
            provider: "block_content",
          },
        };
        resolv(this.bPost("/vuejs-entity/entity/add-block-in-region", values));
      } else {
        this.messages.warnings.push(
          " Impossible d'ajouter le bloc, region : " + region
        );
        reject();
      }
    });
  },
  // On ajoute la config pour le footer du layout.
  createBlockContentFooter(state) {
    state.storeForm.footer_paragraph.model.field_domain_access = [
      { target_id: this.domainRegister.id },
    ];
    state.storeForm.footer_paragraph.model.field_domain_source = [
      { target_id: this.domainRegister.id },
    ];
    return this.bPost(
      "/vuejs-entity/entity/add-paragrph-in-entity/block_content/footer",
      {
        paragraph: state.storeForm.footer_paragraph.model,
        entity: {
          info: [{ value: " Pied de page " }],
          field_domain_access: [{ target_id: this.domainRegister.id }],
          field_domain_source: [{ target_id: this.domainRegister.id }],
        },
      }
    );
  },

  generateStyleTheme() {
    return new Promise((resolv, reject) => {
      const idHome = window.location.pathname.split("/").pop();
      // On recupere le style definit dans model_cv pour mettre au niveau du fichier custom(.js|.scss) du theme.
      this.bGet(
        "/generate_style_theme/set_default_style/" +
          idHome +
          "/" +
          this.domainRegister.id +
          "/model_cv"
      )
        .then(() => {
          // On charge les styles. ( mise à jour des imports scss. )
          this.bGet(
            "/layoutgenentitystyles/manuel/api-generate/" +
              this.domainRegister.id
          )
            .then(() => {
              resolv(
                // On regenere le theme.
                this.bGet(
                  "/generate-style-theme/update-style-theme/" +
                    this.domainRegister.id
                )
              );
            })
            .catch(() => {
              reject();
            });
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  /**
   *
   * @param {*} resp
   */
  runErrorsMessages(resp) {
    this.messages.errors.push(
      "<h3> Oups! Un problème est survenu. Veuillez réessayer </h3>"
    );
    if (typeof resp === "string" || resp instanceof String) {
      this.messages.errors.push(resp);
    }
    store.commit("SET_ERROR_MESSAGES", this.messages.errors);
    store.commit("storeForm/CLEAN_LOCALSTORAGE");
    this.runWarningsMessages();
  },
  /**
   * -
   */
  runWarningsMessages() {
    if (this.messages.warnings.length)
      store.commit("SET_WARNING_MESSAGES", this.messages.warnings);
  },
};
