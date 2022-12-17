import React, { useContext, useEffect, useState } from 'react'
import { TextField, Typography, Grid, Button, 
    FormControl, InputLabel, Select, MenuItem 
} from '@material-ui/core';

import { ExpenseTrackerContext } from '../../../context/context';

import useStyles from './styles';
import { v4 as uuidv4 } from 'uuid';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import formatDate from '../../../utils/formatDate';

import { useSpeechContext } from '@speechly/react-client';
const initialState = {
    amount: '',
    category: '',
    type: "Income",
    date: formatDate(new Date())
}
const Form = () => {
  const classes = useStyles()

  const { addTransaction } = useContext(ExpenseTrackerContext)
  const [formData, setformData] = useState(initialState);
  
  const { segment } = useSpeechContext();
  const createTransaction = () => {
    const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() }
    addTransaction(transaction)
    setformData(initialState)
  }

  useEffect(()=>{
    if(segment){
        if(segment.intent.intent === "add_expense"){
            setformData({ ...formData, type: "Expense" })
        }
        else if(segment.intent.intent === "add_income"){
            setformData({ ...formData, type:"Income" })
        }
        else if(segment.isFinal && segment.intent.intent === "create_transaction"){
            return createTransaction()
        }
        else if(segment.isFinal && segment.intent.intent === "cancel_transaction"){
            return setformData(initialState)
        }

        segment.entities.forEach((e) => {
            const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`
            switch (e.type){
                case 'amount':
                    setformData({ ...formData, amount: e.value })
                    break;
                case 'category':
                    setformData({ ...formData, category: e.value })
                    break;
                case 'date':
                    setformData({ ...formData, date: e.value })
                    break;
                default:
                    break;  
            }
        })
    }
  },[segment])

  const selectedCategories = formData.type === "Income" ? incomeCategories : expenseCategories;
  return (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography align='center' variant='subtitle2' gutterBottom>
                {segment && segment.words.map((w) => w.value).join(" ")}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={formData.type} onChange={(e) => setformData({ ...formData, type: e.target.value })}>
                    <MenuItem value={'Income'}>Income</MenuItem>
                    <MenuItem value={'Expense'}>Expense</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e) => setformData({ ...formData, category: e.target.value })}>
                {selectedCategories.map((c) => <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem> )}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
            <TextField type={'number'} label="Amount" fullWidth value={formData.amount} onChange={(e) => setformData({ ...formData, amount: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
            <TextField type={'date'} label="Date" fullWidth value={formData.data} onChange={(e) => setformData({ ...formData, date: formatDate(e.target.value) })} />
        </Grid>
        <Button className={classes.button} varient="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
    </Grid>
  )
}

export default Form