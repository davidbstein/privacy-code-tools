import { useParams } from "react-router-dom";

export default (
    (state) => ({
        model: state.model,
        codingProgress: state.codingProgressStore,
        localState: state.localState,
        route: useParams()
    })
);
  
  