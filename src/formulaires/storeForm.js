import request from "../request";
import user from "../User";
import router from "../router/index";
import generateField from "components_h_vuejs/src/js/FormUttilities";
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
export default {
  namespaced: true,
  state: () => ({
    /**
     * Contient les données de la partie presentation.
     */
    presentaton: {},
    /**
     * Contient les champs du formulaire de la partie presentation.
     */
    fields_presentation: [],
    /**
     * Contient les données de la partie Experience.
     */
    experience: {},
    /**
     * Contient les champs du formulaire de la partie experience.
     */
    fields_experience: [],
    /**
     * Contient le formulaire de la partie formation.
     */
    formation: {},
    /**
     * Contient les champs du formulaire de la partie formation.
     */
    fields_formation: [],
    /**
     * Contient le formulaire de la partie formation.
     */
    entete_paragraph: {},
    /**
     * Les layouts de la sections dynamiques.
     */
    layout_paragraphs: {},
    /**
     * //
     */
    fields_layout_dynamique: [],
    /**
     *
     */
    page_supplementaires: [],
    /**
     * footer_paragraph
     */
    footer_paragraph: {},

    //
    running: false,
    //
    user: {},
    /**
     * Suit la construction des formualires.
     */
    building_fields: false,
    /**
     *  Permet de definir un temps moyen pour la constructin d'un formulaire.
     */
    RunBuildingForm: {
      time: 3000,
      timeout: null,
    },
    /**
     * Contient les données de tous le formulaire.
     */
    EntitiesForm: [],
  }),
  mutations: {
    SET_PRESENTATION(state, payload) {
      state.presentaton = payload;
      localStorage.setItem("app_cv.presentaton", JSON.stringify(payload));
    },
    SET_EXPERIENCE(state, payload) {
      state.experience = payload;
      localStorage.setItem("app_cv.experience", JSON.stringify(payload));
    },
    SET_FORMATION(state, payload) {
      state.formation = payload;
      localStorage.setItem("app_cv.formation", JSON.stringify(payload));
    },
    SET_HEADER(state, payload) {
      state.entete_paragraph = payload;
      localStorage.setItem("app_cv.entete_paragraph", JSON.stringify(payload));
    },
    SET_FOOTER(state, payload) {
      state.footer_paragraph = payload;
      localStorage.setItem("app_cv.footer_paragraph", JSON.stringify(payload));
    },
    SET_EntitiesForm(state, payload) {
      state.EntitiesForm = payload;
      localStorage.setItem("app_cv.entities_form", JSON.stringify(payload));
    },
    SET_layout_paragraphs(state, payload) {
      // state.layout_paragraphs[payload.k] = payload.val;
      state.layout_paragraphs = payload;
      localStorage.setItem(
        "app_cv.layout_paragraphs",
        JSON.stringify(state.layout_paragraphs)
      );
    },
    SET_PAGE_SUPP(state, payload) {
      state.page_supplementaires = payload;
      localStorage.setItem(
        "app_cv.page_supplementaires",
        JSON.stringify(payload)
      );
    },
    ACTIVE_RUNNING(state) {
      state.running = true;
    },
    DISABLE_RUNNING(state) {
      state.running = false;
    },
    // https://stackoverflow.com/questions/64635384/write-data-to-a-nested-dictionary-given-a-key-path-of-unknown-length/64641327#64641327.
    // https://stackoverflow.com/questions/66236245/multi-level-dynamic-key-setting.
    // https://lodash.com/docs/4.17.15#update
    // il faudra faire un tuto
    SET_VALUE(state, payload) {
      console.log(" SET_VALUE payload ", payload);
      function updateSettings(settings, keyPath, value) {
        const keys = keyPath.split(".");
        const targetKey = keys.pop();
        let current = settings;
        for (let i = 0; i < keys.length; ++i) {
          current = current[keys[i]];
          if (!current) {
            throw new Error(" Specified key not found. " + keys[i]);
          }
        }
        current[targetKey] = value;
      }
      switch (router.history.current.path) {
        case "/presentation":
          updateSettings(state.presentaton, payload.fieldName, payload.value);
          break;
        case "/experience":
          updateSettings(state.experience, payload.fieldName, payload.value);
          break;
        case "/formation":
          updateSettings(state.formation, payload.fieldName, payload.value);
          break;
        default:
          if (
            router.history.current.path.includes("layouts-sections") &&
            router.history.current.params.keySections
          ) {
            updateSettings(
              state.layout_paragraphs,
              payload.fieldName,
              payload.value
            );
          }
          break;
      }
    },

    SET_USER(state, payload) {
      state.user = payload;
    },
    CLEAN_LOCALSTORAGE() {
      localStorage.removeItem("app_cv.presentaton");
      localStorage.removeItem("app_cv.experience");
      localStorage.removeItem("app_cv.formation");
      localStorage.removeItem("app_cv.entete_paragraph");
      localStorage.removeItem("app_cv.footer_paragraph");
      localStorage.removeItem("app_cv.entities_form");
      localStorage.removeItem("app_cv.hash");
    },
    /**
     * il est assez complique de suivre, la construction d'un formulaire;
     * donc, on va fixer une valeur de 3s par appel.
     * @param {*} state
     */
    RUN_BUILDING_FIELDS(state) {
      state.building_fields = true;
      clearTimeout(state.RunBuildingForm.timeout);
      state.RunBuildingForm.timeout = setTimeout(() => {
        state.building_fields = false;
      }, state.RunBuildingForm.time);
    },
    SET_FIELDS_PRESENTATION(state, payload) {
      state.fields_presentation = payload;
    },
    SET_FIELDS_EXPERIENCE(state, payload) {
      state.fields_experience = payload;
    },
    SET_FIELDS_FORMATION(state, payload) {
      state.fields_formation = payload;
    },
    SET_FIELDS_LAYOUT_FORMATIONS(state, payload) {
      state.fields_layout_dynamique = payload;
    },
  },
  actions: {
    loadForm({ commit, state, dispatch }) {
      commit("ACTIVE_RUNNING");
      const param = {
        id: window.location.pathname.split("/").pop(),
        entity_type_id: "model_cv",
      };
      request
        .bPost("/vuejs-entity/form/get-form/from/entity-id", param, {}, false)
        .then((resp) => {
          console.log("loadForm : ", resp.data[0]);
          commit("DISABLE_RUNNING");
          commit("SET_EntitiesForm", resp.data);
          setTimeout(() => {
            console.log("state : ", state);
            const entities = resp.data[0].entities;
            // Recuperation des pages supplementaires :
            if (
              resp.data[0].entity &&
              resp.data[0].entity.page_supplementaires
            ) {
              commit("SET_PAGE_SUPP", resp.data[0].entity.page_supplementaires);
            }
            // Recuperation du paragraph presentation.
            // if (entities.presentation) {
            //   commit("SET_PRESENTATION", entities.presentation);
            //   dispatch("buildFieldsPresentation");
            // }
            // Recuperation du paragraph experience.
            if (entities.experience) {
              commit("SET_EXPERIENCE", entities.experience);
              dispatch("buildFieldsExperience");
            }
            // Recuperation du paragraph formation.
            if (entities.formation) {
              commit("SET_FORMATION", entities.formation);
              dispatch("buildFieldsFormation");
            }
            // Recuperation de l'entete.
            if (entities.entete_paragraph) {
              commit("SET_HEADER", entities.entete_paragraph);
            }
            // Recuperation du footer.
            if (entities.footer_paragraph) {
              commit("SET_FOOTER", entities.footer_paragraph);
            }
            //
            if (entities.layout_paragraphs) {
              commit("SET_layout_paragraphs", entities.layout_paragraphs);
              dispatch("buildFieldsDynamiqueStep");
            }
          }, 200);
        });
    },
    loadFormOLD({ commit }) {
      commit("ACTIVE_RUNNING");
      const param = {
        id: window.location.pathname.split("/").pop(),
        entity_type_id: "model_cv",
      };
      //  on recupere la valeur hash
      const urlParams = new URLSearchParams(window.location.search);
      const hash = urlParams.get("hash");
      // on verifie si on a des données en cache.
      if (
        localStorage.getItem("app_cv.presentaton") &&
        hash == localStorage.getItem("app_cv.hash")
      ) {
        commit(
          "SET_PRESENTATION",
          JSON.parse(localStorage.getItem("app_cv.presentaton"))
        );
        commit(
          "SET_EXPERIENCE",
          JSON.parse(localStorage.getItem("app_cv.experience"))
        );
        commit(
          "SET_FORMATION",
          JSON.parse(localStorage.getItem("app_cv.formation"))
        );
        commit(
          "SET_HEADER",
          JSON.parse(localStorage.getItem("app_cv.entete_paragraph"))
        );
        commit(
          "SET_FOOTER",
          JSON.parse(localStorage.getItem("app_cv.footer_paragraph"))
        );
        // page_supplementaires
        commit(
          "SET_PAGE_SUPP",
          JSON.parse(localStorage.getItem("app_cv.page_supplementaires"))
        );
        // Recupere les entites de base.
        commit(
          "SET_EntitiesForm",
          JSON.parse(localStorage.getItem("app_cv.entities_form"))
        );
        //
        var datas = JSON.parse(
          localStorage.getItem("app_cv.layout_paragraphs")
        );
        for (const i in datas) {
          commit("SET_layout_paragraphs", {
            k: i,
            val: datas[i],
          });
        }

        commit("DISABLE_RUNNING");
      } else {
        // On se rassure que l'utilisateur est sur la page d'accuiel;
        request
          .bPost("/vuejs-entity/form/get-form/from/entity-id", param, {}, false)
          .then((resp) => {
            if (window.location.hash != "#/presentation") {
              commit("CLEAN_LOCALSTORAGE");
              router.push({ path: `/presentation` });
            }
            commit("DISABLE_RUNNING");
            // Recuperation des pages supplementaires :
            if (resp.data.entity && resp.data.entity.page_supplementaires) {
              commit("SET_PAGE_SUPP", resp.data.entity.page_supplementaires);
            }
            if (
              resp.data.entity &&
              resp.data.entity.presentation &&
              resp.data.entity.presentation.length
            ) {
              // Recuperation du paragraph presentation.
              const param2 = {
                id: resp.data.entity.presentation[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param2,
                  {},
                  false
                )
                .then((pres) => {
                  commit("SET_PRESENTATION", pres.data);
                });
              //
              const param3 = {
                id: resp.data.entity.experience[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param3,
                  {},
                  false
                )
                .then((pres) => {
                  commit("SET_EXPERIENCE", pres.data);
                });
              //
              const param4 = {
                id: resp.data.entity.formation[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param4,
                  {},
                  false
                )
                .then((pres) => {
                  commit("SET_FORMATION", pres.data);
                });
              //
              const param5 = {
                id: resp.data.entity.entete_paragraph[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param5,
                  {},
                  false
                )
                .then((res) => {
                  commit("SET_HEADER", res.data);
                });
              //
              const param6 = {
                id: resp.data.entity.footer_paragraph[0].target_id,
                entity_type_id: "paragraph",
                duplicate: true,
              };
              request
                .bPost(
                  "/vuejs-entity/form/get-form/from/entity-id",
                  param6,
                  {},
                  false
                )
                .then((res) => {
                  commit("SET_FOOTER", res.data);
                });

              // Recuperation des données dans la section.
              resp.data.entity.layout_paragraphs.forEach((target_id) => {
                request
                  .bPost(
                    "/vuejs-entity/form/get-form/from/entity-id",
                    {
                      id: target_id.target_id,
                      entity_type_id: "paragraph",
                      duplicate: true,
                    },
                    {},
                    false
                  )
                  .then((res) => {
                    console.log("section : ", res.data);
                    if (
                      res.data &&
                      res.data.entity.type[0] &&
                      res.data.entity.type[0].target_id != "buttons_download_cv"
                    ) {
                      commit("SET_layout_paragraphs", {
                        k: res.data.entity.type[0].target_id,
                        val: res.data,
                      });
                    }
                  });
              });
              //
              localStorage.setItem("app_cv.hash", hash);
            }
          })
          .catch(() => {
            commit("DISABLE_RUNNING");
          });
      }
    },
    /**
     * Generate CV.
     * @param {*} param0
     * @returns
     */
    saveEntity({ commit, state }) {
      return new Promise((resolv, reject) => {
        const params = {
          presentaton: state.presentaton,
          experience: state.experience,
          formation: state.formation,
        };
        request
          .bPost("/buildercv/generate-cv", params, {})
          .then((resp) => {
            resolv(resp);
          })
          .catch((er) => {
            reject(er);
          });
      });
    },
    // Permet de mettre à jour un champs ...
    setValue({ commit }, payload) {
      commit("SET_VALUE", payload);
    },
    /**
     * Check-if user is login.
     */
    checkStatusUser({ commit }) {
      user.getCurrentUser().then((user) => {
        commit("SET_USER", user);
      });
    },
    /**
     * Quel est son interet ??
     * @param {*} param0
     */
    updateLocalStorage({ commit, state }) {
      commit("SET_PRESENTATION", state.presentaton);
      commit("SET_EXPERIENCE", state.experience);
      commit("SET_FORMATION", state.formation);
    },
    buildFieldsPresentation({ commit, state }) {
      var fields = [];
      loadField.setConfig(request);
      commit("RUN_BUILDING_FIELDS");
      if (state.presentaton.length) {
        generateField
          .generateFields(state.presentaton, fields, "")
          .then((resp) => {
            commit("SET_FIELDS_PRESENTATION", resp);
          });
      }
    },
    buildFieldsExperience({ commit, state }) {
      loadField.setConfig(request);
      commit("RUN_BUILDING_FIELDS");
      if (state.experience.length) {
        generateField.generateFields(state.experience, [], "").then((resp) => {
          commit("SET_FIELDS_EXPERIENCE", resp);
        });
      }
    },
    buildFieldsFormation({ commit, state }) {
      loadField.setConfig(request);
      commit("RUN_BUILDING_FIELDS");
      if (state.formation.length) {
        generateField.generateFields(state.formation, [], "").then((resp) => {
          commit("SET_FIELDS_FORMATION", resp);
        });
      }
    },
    buildFieldsDynamiqueStep({ commit, state }) {
      loadField.setConfig(request);
      commit("RUN_BUILDING_FIELDS");
      var keySections = 0;
      if (
        state.formation.length &&
        router.history.current &&
        router.history.current.params &&
        router.history.current.params.keySections
      ) {
        keySections = router.history.current.params.keySections;
      }
      console.log("hello: buildFieldsDynamiqueStep");
      generateField
        .generateFields([state.layout_paragraphs[keySections]], [], "")
        .then((resp) => {
          //pour ce cas specifique, on retourne unquement la premiere entére,
          // Car on souhaite uniquement construire les entites par page.
          if (resp[0]) commit("SET_FIELDS_LAYOUT_FORMATIONS", resp[0]);
        });
    },
  },
  getters: {
    //
  },
};
